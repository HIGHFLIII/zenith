#!/bin/sh
# Save a copy of the Zenith database and the local password file.
# Run from anywhere: sudo bash scripts/backup.sh
set -eu
cd "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/.."

if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
  backup_home=$(getent passwd "$SUDO_USER" | cut -d: -f6)
  if [ -z "$backup_home" ]; then
    backup_home="/home/$SUDO_USER"
  fi
else
  backup_home=$HOME
fi

stamp=$(date +%Y-%m-%d-%H%M%S)
dest="$backup_home/zenith-backups/$stamp"
mkdir -p "$dest"

if ! docker compose exec -T db sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
  echo "The database is not running. Start the site, then try the backup again."
  exit 1
fi

docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges' >"$dest/database.sql"

if ! [ -s "$dest/database.sql" ]; then
  echo "The backup file is empty, so it was not kept."
  rm -rf "$dest"
  exit 1
fi

case $(head -n 1 "$dest/database.sql") in
  --*) ;;
  *)
    echo "The database copy does not look like a backup, so it was not kept."
    rm -rf "$dest"
    exit 1
    ;;
esac

if [ -f .env ]; then
  cp .env "$dest/.env"
else
  echo "No .env file was found. The database was still saved."
fi

if git rev-parse --short HEAD >"$dest/git-revision.txt" 2>/dev/null; then
  :
else
  rm -f "$dest/git-revision.txt"
fi

cat >"$dest/README.txt" <<EOF
Zenith backup
Created: $stamp

database.sql is the games, reviews, and other saved rows.
.env is the database password file for this computer.

The website code is kept on GitHub:
https://github.com/HIGHFLIII/zenith

To put this backup back, run:
sudo bash $(pwd)/scripts/restore-backup.sh $dest
Then type yes when it asks.
EOF

if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
  chown -R "$SUDO_USER:$SUDO_USER" "$backup_home/zenith-backups"
fi

echo "Backup saved at:"
echo "$dest"
echo "That folder holds the database and the password file."
echo "Copy it to another computer when you can. A backup that stays only on this machine is lost if the disk fails."
