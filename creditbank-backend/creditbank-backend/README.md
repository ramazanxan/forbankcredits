# CreditBank Backend

A Django REST Framework backend for the CreditBank application.

## Tech Stack

- Python 3.11
- Django 4.2
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- OpenAPI/Swagger (drf-spectacular)
- PostgreSQL / SQLite

## Quick Start

### Local Development (SQLite)

```bash
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Docker

```bash
cp .env.example .env
docker-compose up --build
```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs/
- OpenAPI Schema: http://localhost:8000/api/schema/

## Endpoints

### Auth
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout (clears refresh cookie)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Current user info

### Profile
- `GET /api/profile` - Get profile
- `PATCH /api/profile` - Update profile

### Loans
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan application
- `GET /api/loans/{id}` - Get loan details
- `PATCH /api/loans/{id}` - Update loan
- `GET /api/loans/{id}/schedule` - Payment schedule

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `GET /api/payments/{id}` - Get payment details

### Dashboard
- `GET /api/dashboard` - Aggregated statistics

### Scoring
- `POST /api/scoring/predict` - Credit score prediction

### Batch
- `POST /api/batch/run` - Batch scoring

## User Roles

- `client` - Can manage own loans and payments
- `moderator` - Can view and manage all loans
- `admin_it` - IT administrator
- `admin_bank` - Bank administrator
