# CSRD Form Technical Test - Frontend

Welcome to the Kiosk CSRD Form technical assessment. This project is a React Router V7 application built to evaluate your frontend development skills.

## Overview

This technical test involves creating a CSRD (Corporate Sustainability Reporting Directive) Disclosure Requirement form. The application should allow users to:

1. View questions from a Disclosure Requirement (DR)
2. Answer questions through a form interface
3. Save answers to a PostgreSQL database

## Tech Stack

- **Framework**: React Router V7 (in framework mode)
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Database**: PostgreSQL (Docker container)
- **ORM**: Prisma 7
- **Testing**: Vitest
- **Architecture**: Domain-Driven Design (DDD)

## Prerequisites

- Node.js v23.3+
- pnpm 10.0+
- Docker and Docker Compose

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the Database

```bash
docker-compose up
```

This will start a PostgreSQL database with the following credentials:

- **Host**: localhost:5438 (configurable via `POSTGRES_PORT` in `.env`)
- **Database**: csrd_db
- **User**: csrd
- **Password**: csrd_password

**Note**: If you already have a database running on port 5438, you can change the port by editing the `POSTGRES_PORT` variable in your `.env` file.

### 3. Run Migrations

```bash
pnpm migrate
```

### 4. Generate Prisma Client

```bash
pnpm prisma generate
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Your Task

### Objective

Complete the implementation of the CSRD form in `app/routes/home.tsx`. The form should:

1. **Display Questions**: Load and display questions from the Disclosure Requirement
2. **Capture Answers**: Create a form to collect user answers
3. **Save to Database**: Persist answers to the PostgreSQL database

**You are free to rewrite any part of the codebase** if you believe a different approach would be better. The provided structure (DDD architecture, services, repositories) is a starting point, but you can:

- Restructure the architecture if you have a better design in mind
- Modify or replace the domain models
- Change the service layer implementation
- Use different patterns or libraries
- Simplify or extend the existing code

Feel free to be creative and show us your preferred way of building frontend applications!

## Structure of S1-6.csv

The file `S1-6.csv` contains the sample list of datapoints.

Here are the columns:

- id
- question label en / question label fr
- content
  - defines the expected input type for this question.
  - possible values:
    - "number" → numeric value
    - "text" → free-text input
    - "enum" → selectable value from a list
    - "table" → multi-row / multi-field structure (you may simplify this for the exercise)
    - "" (empty) → this question does not expect a content, it is usually the title of another question
- related question id
  - if present, this question is logically linked to another question.
  - typical use cases:
    - table rows
    - hierarchical visibility (nested follow-up questions)
- order
  - suggested position of the question within its group.
- unit
  - indicates a measurement unit (e.g. %, €, hours).
- enum fr / enum en
  - Applies only when content = "enum".
  - Contain semicolon-separated lists of possible values in French or English.

### Example:

| id   | question label en   | content | related question id |
| ---- | ------------------- | ------- | ------------------- |
| Q100 | Employee details    | table   |                     |
| Q101 | Employee birth year | number  | Q100                |

Here:

- Q100 defines a table section.
- Q101 is a row/field of that table because it references Q100.

Example of how it could be rendered:

| Employee details | Value |
| ---------------- | ----- |
| Employee details |       |

## Questions?

If you have any questions about the requirements or encounter any issues with the setup, please don't hesitate to reach out (feel free to email `sabine@meetkiosk.com` or `mathys@meetkiosk.com`).

Good luck! We're excited to see your implementation.
