# Transaction Management System

A simple transaction management system: a REST API for data operations and a
web frontend for displaying and adding transactions. Transactions are stored in
a CSV file.

- **Backend:** Node.js + Express + TypeScript (CSV storage via `csv-parser` / `csv-writer`)
- **Frontend:** React + Vite + TypeScript (Tailwind CSS + shadcn/ui)

---

## Table of contents

- [Features](#features)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the application](#running-the-application)
- [API documentation](#api-documentation)
- [Testing](#testing)
- [Data format](#data-format)
- [Notes on design decisions](#notes-on-design-decisions)

---

## Features

- View all transactions in a table (Date, Account Number, Account Holder, Amount, Status).
- Add a transaction through a modal form.
- A status (**Pending**, **Settled**, or **Failed**) is assigned **randomly on the server**.
- Colored status indicators: Pending (yellow), Settled (green), Failed (red).
- Input validation on both the client and the server using the same rules.
- Centralized error handling with consistent JSON error responses.

---

## Project structure

```
.
├── backend/                  # Express API (TypeScript)
│   ├── src/
│   │   ├── server.ts         # entry point: starts the HTTP server
│   │   ├── app.ts            # Express app: middleware + routes
│   │   ├── app.test.ts       # API integration tests
│   │   ├── routes/           # URL -> controller wiring
│   │   ├── controllers/      # HTTP layer (request/response)
│   │   ├── services/         # business logic + CSV data access
│   │   ├── validators/       # zod schemas
│   │   ├── middleware/       # validation, error handling, 404
│   │   ├── errors/           # AppError hierarchy
│   │   └── types.ts          # shared domain types
│   └── data/transactions.csv # the data store
│
└── frontend/                 # React + Vite app (TypeScript)
    └── src/
        ├── components/       # TransactionTable, AddTransactionModal, StatusBadge
        ├── pages/            # Home
        ├── hooks/            # React Query hooks
        ├── services/         # API client + ApiError
        └── validators/       # zod schema for the form
```

---

## Prerequisites

You need the following installed before starting. If you don't have them, follow
the linked instructions.

| Tool    | Version          | How to get it |
| ------- | ---------------- | ------------- |
| Node.js | 20 or newer (developed on 22.x) | <https://nodejs.org> — download the LTS installer |
| npm     | comes with Node.js | included with the Node.js install |

To check what you have, open a terminal and run:

```bash
node --version
npm --version
```

Both commands should print a version number. If `node` is not found, install
Node.js first.

> The backend and frontend are two separate projects, each with its own
> dependencies. You will install and run them separately.

---

## Installation

Clone the repository, then install dependencies for **both** projects.

```bash
# 1. clone and enter the project
git clone https://github.com/skollnik/transaction-management-system.git
cd transaction-management-system

# 2. install backend dependencies
cd backend
npm install

# 3. install frontend dependencies
cd ../frontend
npm install
```

---

## Configuration

Both projects work out of the box with sensible defaults, so **no configuration
is required** to run them locally. The settings below are optional.

### Backend (`backend/`)

Create a file named `.env` in the `backend/` folder if you want to override defaults:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `4000`  | Port the API server listens on |

Example `backend/.env`:

```
PORT=4000
```

### Frontend (`frontend/`)

The frontend reads the backend URL from an environment variable. A template is
provided in `frontend/.env.example`. To customize it, create `frontend/.env`:

| Variable       | Default                 | Description |
| -------------- | ----------------------- | ----------- |
| `VITE_API_URL` | `http://localhost:4000` | Base URL of the backend API |

Example `frontend/.env`:

```
VITE_API_URL=http://localhost:4000
```

> If you change the backend `PORT`, update `VITE_API_URL` to match.

---

## Running the application

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — start the backend

```bash
cd backend
npm run dev
```

You should see:

```
Transaction API listening on http://localhost:4000
```

### Terminal 2 — start the frontend

```bash
cd frontend
npm run dev
```

Vite will print a local URL, usually:

```
http://localhost:5173
```

Open **<http://localhost:5173>** in your browser. The table should load with the
sample transactions.

### Production build (optional)

```bash
# backend: compile TypeScript and run the compiled output
cd backend
npm run build
npm start

# frontend: build static assets into frontend/dist
cd frontend
npm run build
npm run preview   # serves the production build locally
```

---

## API documentation

Base URL: `http://localhost:4000`

### `GET /transactions`

Returns all transactions.

**Response — `200 OK`**

```json
[
  {
    "transactionDate": "2025-03-01",
    "accountNumber": "7289-3445-1121",
    "accountHolderName": "Maria Johnson",
    "amount": 150,
    "status": "Settled"
  }
]
```

**Example**

```bash
curl http://localhost:4000/transactions
```

---

### `POST /transactions`

Adds a new transaction. The `status` is **not** sent by the client — the server
assigns one of `Pending` / `Settled` / `Failed` at random.

**Request body**

| Field               | Type   | Rules |
| ------------------- | ------ | ----- |
| `transactionDate`   | string | `YYYY-MM-DD`, must be a real calendar date |
| `accountNumber`     | string | format `####-####-####` (e.g. `1234-5678-9012`) |
| `accountHolderName` | string | non-empty |
| `amount`            | number | greater than 0 |

**Request example**

```bash
curl -X POST http://localhost:4000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionDate": "2025-06-01",
    "accountNumber": "1234-5678-9012",
    "accountHolderName": "Jane Doe",
    "amount": 199.99
  }'
```

**Response — `201 Created`**

```json
{
  "transactionDate": "2025-06-01",
  "accountNumber": "1234-5678-9012",
  "accountHolderName": "Jane Doe",
  "amount": 199.99,
  "status": "Pending"
}
```

**Response — `400 Bad Request`** (validation failed)

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "amount", "message": "Amount must be greater than 0" }
  ]
}
```

Other responses: `404 Not Found` for unknown routes, `500 Internal Server Error`
for unexpected failures — all returned as `{ "error": "..." }`.

---

## Testing

### Automated tests (backend)

The backend has an integration test suite (Vitest + Supertest) covering the API
endpoints. The tests run against a temporary CSV file, so your sample data is
never touched.

```bash
cd backend
npm test
```

This verifies that:

- `GET /transactions` returns the stored transactions.
- `POST /transactions` creates a record and assigns a valid random status.
- A created transaction is persisted and returned by a subsequent `GET`.
- Invalid input is rejected with `400` and per-field error details.
- Unknown routes return `404`.

### Manual testing through the UI

1. Start both servers (see [Running the application](#running-the-application)).
2. Open <http://localhost:5173>.
3. Confirm the table shows the sample transactions with colored status badges.
4. Click **Add Transaction** to open the modal and try the following:
   - Submit with empty fields → per-field validation errors appear.
   - Type digits into **Account Number** → dashes are inserted automatically
     (`1234-5678-9012`).
   - Enter an invalid date (e.g. `2025-02-30`) → it is rejected.
   - Enter a valid transaction and submit → the modal closes and the new row
     appears in the table with a randomly assigned status.

### Testing the API directly

With the backend running, use `curl` (examples above) or any API client
(Postman, Insomnia). Try a valid request, then an invalid one (bad date,
wrong account number format, negative amount) to see the `400` responses.

---

## Data format

Transactions are stored in `backend/data/transactions.csv` with these columns:

```
Transaction Date,Account Number,Account Holder Name,Amount,Status
2025-03-01,7289-3445-1121,Maria Johnson,150.00,Settled
```

- **Transaction Date** — `YYYY-MM-DD`
- **Account Number** — `####-####-####`
- **Account Holder Name** — text
- **Amount** — decimal with two places
- **Status** — `Pending`, `Settled`, or `Failed`

---

## Notes on design decisions

- **Layered backend** — `routes → controllers → services → CSV` keeps each
  concern isolated and easy to follow.
- **Server-assigned status** — the random status is generated on the server, not
  trusted from the client.
- **Shared validation rules** — the same constraints (date, account number
  format, positive amount) are enforced by zod on both the backend and the
  frontend, so users get fast feedback and the server stays the source of truth.
- **Concurrency-safe writes** — appends to the CSV are serialized so two
  simultaneous requests can't corrupt the file. A CSV is not a production
  database; a real system would use one (and likely add an `id` per record).
- **Duplicated types** — backend and frontend are independent projects, so a
  small `Transaction` type is defined in each rather than introducing a shared
  package for this scope.
