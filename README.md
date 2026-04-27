# POS Case Study

A Point-of-Sale (POS) system with a separated **React** frontend and **Laravel** backend.

## Project Structure

```
pos-case-study/
├── frontend/          # React app (Create React App)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Laravel API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── composer.json
│   └── ...
└── README.md
```

---

## Frontend (React)

### Setup

```bash
cd frontend
npm install
npm start
```

Runs on **http://localhost:3000**

### Tech Stack
- React 19 + React Router 7
- Bootstrap 5
- Axios (HTTP client)

---

## Backend (Laravel)

### Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Runs on **http://localhost:8000**

### API Endpoints — User Management

| Method   | Endpoint           | Description          |
|----------|--------------------|----------------------|
| `GET`    | `/api/users`       | List all users       |
| `POST`   | `/api/users`       | Create a new user    |
| `GET`    | `/api/users/{id}`  | Get a single user    |
| `PUT`    | `/api/users/{id}`  | Update a user        |
| `DELETE` | `/api/users/{id}`  | Delete a user        |

### Tech Stack
- PHP 8.2+ / Laravel 11
- MySQL
- Laravel Sanctum (API auth)

---

## Running Both

Open two terminal windows:

```bash
# Terminal 1 — Backend
cd backend && php artisan serve

# Terminal 2 — Frontend
cd frontend && npm start
```
