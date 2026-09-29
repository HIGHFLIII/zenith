# Zenith

Zenith is a website for keeping your games in one library. A game such as Cyberpunk 2077 can exist once, then show up again for each place you own it: Steam, Xbox, PlayStation, GOG, and so on.

This version is the foundation. You can open the pages, look at sample games, and store those samples in a database on your computer. Steam, Xbox, PlayStation, Nintendo, Epic Games, GOG, Google Play, and Apple are **not connected**. No accounts are signed in, and no store is contacted.

Later, Zenith can connect to real game stores. That work is not part of this version.

## Required software

Install these before you start:

1. **Node.js 20.9 or newer** (this project was built with Node.js 22). Download it from [https://nodejs.org](https://nodejs.org). Installing Node.js also installs npm.
2. **Docker** with Docker Compose. Docker runs the database. On Windows or Mac, install [Docker Desktop](https://www.docker.com/products/docker-desktop/). On Linux, install Docker Engine and the Compose plugin.
3. A terminal (Command Prompt, PowerShell, or Terminal) and a copy of this project folder.

You do not need a Steam account, an API key, or a paid database.

## How to install dependencies

Open a terminal in this project folder, then run:

```bash
npm install
```

That downloads the code libraries the website needs. You only need to do this again after the project’s dependencies change.

## How to start PostgreSQL

PostgreSQL is the database. It runs inside Docker so you do not install it by hand.

1. In the project folder, copy the example settings file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell you can run `Copy-Item .env.example .env` instead.

   The example file already has a password that is only meant for the database on your computer. You can keep it. Details are in [Where environment variables go](#where-environment-variables-go).

2. Start only the database:

   ```bash
   docker compose up -d db
   ```

   The first run downloads the PostgreSQL image. When it finishes, the database keeps running in the background. Your games stay saved in a Docker volume named `zenith_postgres_data`.

The database image works on a normal PC and on a Raspberry Pi 5.

## How to run Prisma migrations

Prisma creates the tables Zenith needs (users, games, libraries, reviews, and the rest).

From the project folder, with PostgreSQL already running:

```bash
npx prisma generate
npx prisma migrate deploy
```

`prisma generate` builds the code the website uses to talk to the database. `prisma migrate deploy` creates the tables from the files in `prisma/migrations`.

If you later change `prisma/schema.prisma`, a developer creates a new migration with:

```bash
npx prisma migrate dev
```

You do not need that command just to start the sample site.

## How to seed the database

Seeding fills the database with sample games: Minecraft, Cyberpunk 2077, Warframe, Baldur's Gate 3, Helldivers 2, and Deep Rock Galactic. It also adds platforms, a demo library, reviews, and ratings.

```bash
npx prisma db seed
```

You can run that again later. It replaces the sample rows. It does not talk to Steam or any other store.

Home, My Library, Games, Reviews, Friends, Profile, and Settings read those rows from PostgreSQL. Until you seed, those pages say the database has no games. The Admin page is still a sample dashboard.

On My Library you can add a game you own. On Settings you can save the name the site shows. Neither one contacts Steam or any other store. The sample games stay in the database until you remove them. Removing games is not available yet.

### On a Raspberry Pi, without Node.js

The Pi copy of this project runs the site in Docker, so Node.js does not have to be installed on the Pi itself. From the project folder (`~/zenith` on the Pi):

```bash
sudo bash scripts/load-sample-data.sh
```

That creates the tables and loads the six sample games. The first run downloads a Node image and installs libraries, so it takes a while. When it finishes, rebuild the site so Home and My Library use the new code:

```bash
sudo docker compose up -d --build
```

Then refresh the site. Do not add `-v` to any Docker command. That flag deletes the database.

## How to start the website

**On your computer (best while you are changing the site)**

Leave PostgreSQL in Docker, then start the site:

```bash
npm run dev
```

Leave that terminal open. The site reloads when files change. It listens on every network interface, port **43123**.

**Entirely inside Docker**

This builds the site and starts it next to the database:

```bash
docker compose up --build
```

The first build takes a few minutes. The site is again on port **43123**.

## How to stop the Docker containers

In the project folder:

```bash
docker compose down
```

That stops the database and, if you started it, the website container. Your database files stay in the Docker volume, so the sample data is still there next time.

Do not add `-v` unless you mean to delete the database. `docker compose down -v` erases the saved data.

To stop only the website you started with `npm run dev`, go to that terminal and press `Ctrl+C`. That does not stop PostgreSQL. Use `docker compose down` when you also want the database to stop.

## How to back up the website

The website code is already on GitHub. A backup saves the two things that exist only on your computer: the database (games, reviews, and the rest) and the `.env` password file.

The database container has to be running. From the project folder:

```bash
sudo bash scripts/backup.sh
```

On the Raspberry Pi, run that from `~/zenith`. Each run creates a new folder under `~/zenith-backups/`, named with the date and time. Copy that folder to another computer when you can. A backup that stays only on the Pi is lost if the Pi’s card fails.

To put a backup back, the database container has to be running. This replaces the current rows:

```bash
sudo bash scripts/restore-backup.sh ~/zenith-backups/2026-09-29-010000
```

Use the real folder name. The command asks you to type `yes` before it changes anything.

## Where environment variables go

Settings such as the database password live in a file named `.env` in the project folder.

1. Copy `.env.example` to `.env` (see [How to start PostgreSQL](#how-to-start-postgresql)).
2. Open `.env` in a text editor if you want to change the local password.

The names you will see:

| Name | What it is |
| --- | --- |
| `POSTGRES_USER` | The database user Docker creates. |
| `POSTGRES_PASSWORD` | That user’s password. Use letters and numbers only. |
| `POSTGRES_DB` | The database name. |
| `POSTGRES_PORT` | The port on your computer (5432 unless you change it). |
| `DATABASE_URL` | The full address the website and Prisma use. It must use the same user, password, database name, and port. |

Example shape:

```text
DATABASE_URL=postgresql://zenith:zenith_dev_password@localhost:5432/zenith
```

If you change the password, change it in **both** `POSTGRES_PASSWORD` and `DATABASE_URL`.

`.env` stays on your computer. It is listed in `.gitignore`, so Git will not save it. `.env.example` is the safe template with the local-only password and no real accounts.

When the website runs inside Docker Compose, Compose builds a different `DATABASE_URL` for that container so it can reach the database service named `db`. You do not put that address in `.env`. The app reads whatever address it is given when it starts. None of these values are sent to the browser as public settings.

There is no API key to add. External gaming services are not connected.

## How to access the website locally

After `npm run dev` or `docker compose up --build`, open:

[http://127.0.0.1:43123](http://127.0.0.1:43123)

Pages:

- [http://127.0.0.1:43123](http://127.0.0.1:43123) — home
- [http://127.0.0.1:43123/library](http://127.0.0.1:43123/library) — library stored in PostgreSQL
- [http://127.0.0.1:43123/games](http://127.0.0.1:43123/games) — games stored in PostgreSQL
- [http://127.0.0.1:43123/reviews](http://127.0.0.1:43123/reviews) — reviews stored in PostgreSQL
- [http://127.0.0.1:43123/friends](http://127.0.0.1:43123/friends) — other people marked Playing in PostgreSQL
- [http://127.0.0.1:43123/profile](http://127.0.0.1:43123/profile) — profile stored in PostgreSQL
- [http://127.0.0.1:43123/settings](http://127.0.0.1:43123/settings) — platform connections stored in PostgreSQL
- [http://127.0.0.1:43123/admin](http://127.0.0.1:43123/admin) — sample admin page (no login yet)

A small health check is at [http://127.0.0.1:43123/api/health](http://127.0.0.1:43123/api/health). It says the site is running, and whether the database answered. It does not show the database password or address.
