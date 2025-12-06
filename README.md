# TripLink

> Share Rides. Save Money. Travel Smarter.

TripLink is a Django-based web application that connects drivers with available seats to passengers looking for rides. It provides user registration, ride creation (offer a ride), ride searching, and booking functionality via a simple multi-page frontend and a Django REST backend.

## Table of Contents
- [What the project does](#what-the-project-does)
- [Why TripLink is useful](#why-triplink-is-useful)
- [Tech stack](#tech-stack)
- [Get started (development)](#get-started-development)
- [Configuration notes](#configuration-notes)
- [Usage examples](#usage-examples)
- [Where to get help](#where-to-get-help)
- [Maintainers & contributing](#maintainers--contributing)

## What the project does

TripLink provides a minimal, working prototype of a carpooling/ridesharing platform:
- User registration and login pages
- Driver profiles and verification fields
- Create / offer rides (origin, destination, date/time, price, seats)
- Search rides and book seats
- Static multi-page frontend served by Django templates in `frontend/`

## Why TripLink is useful

- Low-friction way to share empty seats and split travel costs
- Lightweight prototype demonstrating a full-stack Django + static frontend approach
- Good starting point for adding real-time features (maps, tracking), payment, and onboarding flows

## Tech stack

- Python, Django 5.2, Django REST Framework
- MySQL (production DB configured in `triplink_backend/settings.py`)
- Vanilla HTML/CSS/JavaScript frontend located in `frontend/`

See `requirements.txt` for exact dependency versions.

## Get started (development)

Prerequisites:
- Python 3.11+ (use `python --version` to confirm)
- pip
- A local MySQL server OR modify settings to use SQLite for local testing

Quick start (recommended for local development):

```powershell
git clone <repo-url>
cd TripLink
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Create a `.env` or set environment vars for DB_PASSWORD and other secrets if using the default DB in settings
python manage.py migrate
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser. The Django templates are served from the `frontend/` directory.

Notes:
- The project `triplink_backend/settings.py` is configured to use a remote MySQL database by default. For local development you can switch `DATABASES` to use SQLite (comment the MySQL block and use `sqlite3` with `BASE_DIR / 'db.sqlite3'`).
- If you keep using MySQL, set `DB_PASSWORD` in your environment before running migrations.

## Configuration notes

- The templates directory is `frontend/` (see `TEMPLATES['DIRS']` in `triplink_backend/settings.py`).
- Static files (CSS/JS) live in `frontend/` and are collected to `staticfiles/` when running `collectstatic`.
- Sensitive values (DB password, secret key) should be supplied via environment variables in production. `python-dotenv` is included in `requirements.txt` if you prefer a `.env` file.

## Usage examples

- The main pages are available in `frontend/`: `index.html`, `find-ride.html`, `offer-ride.html`, `profile.html`, `login.html`, `register.html`.
- Backend view functions rendering templates are in `core/views.py` (e.g., `index`, `find_ride`, `offer_ride`).

Example: to run the site locally and try the find-ride page:

```powershell
python manage.py runserver
# then open http://127.0.0.1:8000/find-ride/
```

## Where to get help

- Read the high-level design and goals in `PROJECT_REPORT.md`.
- For issues, open a GitHub issue in this repository describing steps to reproduce and expected behavior.

## Maintainers & contributing

- Maintainer: repository owner (see the GitHub repository for current maintainers).

Contributing (brief):
- Fork the repository, create a feature branch, and open a pull request.
- Keep changes focused and include tests for non-trivial logic where possible.
- Use the issue tracker to discuss larger changes before implementing them.

If you'd like, I can add a `CONTRIBUTING.md` and a basic test runner next.

---

For more design context, see `PROJECT_REPORT.md`.
