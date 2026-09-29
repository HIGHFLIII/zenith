#!/bin/sh
# Replace the Zenith database with a backup made by scripts/backup.sh.
# Run: sudo bash scripts/restore-backup.sh /home/highfliii/zenith-backups/DATE
set -eu
cd "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/.."

backup_dir=${1:-}
if [ -z "$backup_dir" ] || [ ! -f "$backup_dir/database.sql" ]; then
  echo "Give the backup folder that contains database.sql."
  echo "Example: sudo bash scripts/restore-backup.sh /home/highfliii/zenith-backups/2026-09-29-010000"
  exit 1
fi

if ! docker compose exec -T db sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
  echo "The database is not running. Start the site, then try again."
  exit 1
fi

echo "This replaces the games in the database with the copy in:"
echo "$backup_dir"
printf "Type yes to continue: "
read -r answer
if [ "$answer" != "yes" ]; then
  echo "Nothing was changed."
  exit 1
fi

docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1' <"$backup_dir/database.sql"
echo "The database now matches that backup. Refresh the website."
