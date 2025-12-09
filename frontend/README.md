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
- **Language**: TypeScript (strict mode - no `any`, no `as` type assertions)
- **Database**: PostgreSQL (Docker container)
- **ORM**: Prisma
- **Testing**: Vitest
- **Architecture**: Domain-Driven Design (DDD)

## Project Structure

```
app/
├── application/
│   └── services/
│       └── CSRDFormService.ts        # Service layer for CSRD operations
├── domain/
│   └── csrd-form/
│       ├── Question.ts                # Question entity
│       ├── QuestionAnswer.ts          # Answer entity and DTOs
│       └── DisclosureRequirement.ts   # DR aggregate
├── infrastructure/
│   └── database/
│       ├── prisma-client.ts           # Prisma client configuration
│       └── QuestionAnswerRepository.ts # Repository for answers
├── data/
│   └── disclosure-requirement.json    # Parsed DR questions from Excel
├── routes/
│   └── home.tsx                       # YOUR WORK GOES HERE
└── assets/
    └── kiosk-logo.svg                 # Kiosk logo
```

## Prerequisites

- Node.js 20.19+, 22.12+, or 24.0+
- pnpm 8.0+
- Docker and Docker Compose

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database with the following credentials:
- **Host**: localhost:5432 (configurable via `POSTGRES_PORT` in `.env`)
- **Database**: csrd_db
- **User**: csrd
- **Password**: csrd_password

**Note**: If you already have a database running on port 5432, you can change the port by editing the `POSTGRES_PORT` variable in your `.env` file.

### 3. Run Migrations

```bash
pnpm prisma migrate dev --name init
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

### Implementation Requirements

#### 1. Loader Function

Implement the `loader` function to:
- Import and instantiate `CSRDFormService`
- Call `getDisclosureRequirement()` to fetch questions
- Return the data to be consumed by the component

```typescript
export async function loader({}: Route.LoaderArgs) {
  // TODO: Implement loader
}
```

#### 2. Action Function

Implement the `action` function to:
- Parse form data from the request
- Call `saveAnswer()` or `saveAnswers()` on the service
- Return appropriate response or redirect

```typescript
export async function action({}: Route.ActionArgs) {
  // TODO: Implement action
}
```

#### 3. Component

Implement the `CSRDFormPage` component to:
- Use data from the loader
- Render questions in a user-friendly form
- Handle form submission
- Display appropriate feedback

### Available Service Methods

The `CSRDFormService` provides the following methods:

```typescript
class CSRDFormService {
  // Retrieve the full Disclosure Requirement with all questions
  getDisclosureRequirement(): DisclosureRequirement

  // Save a single answer
  async saveAnswer(dto: CreateQuestionAnswerDTO): Promise<QuestionAnswer>

  // Save multiple answers at once
  async saveAnswers(dtos: CreateQuestionAnswerDTO[]): Promise<QuestionAnswer[]>

  // Get existing answer for a question
  async getAnswerByQuestionId(questionId: string): Promise<QuestionAnswer | null>
}
```

### TypeScript Requirements

This project enforces **strict TypeScript**:

- ❌ **No `any` types** - All types must be explicitly defined
- ❌ **No `as` type assertions** - Use proper type guards or type narrowing
- ✅ Use interfaces and types from the domain layer
- ✅ Leverage TypeScript's type inference where appropriate

### Code Quality Standards

1. **DDD Architecture**: Follow the existing Domain-Driven Design structure
2. **Clean Code**: Write readable, maintainable code with clear naming
3. **Error Handling**: Properly handle errors and edge cases
4. **User Experience**: Create an intuitive, user-friendly interface
5. **Type Safety**: Maintain complete type safety throughout your implementation
6. **Testing**: Unit tests are included for the backend services (see `*.test.ts` files)
7. **Styling**: No styling framework is included - choose your own (CSS, Tailwind, styled-components, etc.)

## Database Schema

The database contains a single table for storing answers:

```prisma
model QuestionAnswer {
  id         String   @id @default(uuid())
  questionId String
  answer     Json     // Can store string, number, boolean, object, or array
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("question_answers")
}
```

The `answer` field uses the `Json` type to support various answer formats:
- String: `"Yes"`, `"This is a narrative answer"`
- Number: `2024`, `42.5`
- Boolean: `true`, `false`
- Object: `{ "value": "test", "metadata": { "source": "manual" } }`
- Array: `["option1", "option2"]`

## Disclosure Requirement Data

The DR data is available in `app/data/disclosure-requirement.json`. It is structured as a **tree** where questions can have nested `relatedQuestions`. The data is parsed from `S1-6.csv` and contains 22 questions with the following structure:

```typescript
interface Question {
  id: string
  kioskId: string
  labelEn: string
  labelFr: string
  type: "table" | "number" | "enum" | "text" | "section"
  order: number
  relatedQuestionId: string | null
  unit: string | null  // e.g., "%" for percentages
  enumValues?: {
    en: string[]  // Available options in English
    fr: string[]  // Available options in French
  }
  relatedQuestions?: Question[]  // Nested child questions
}
```

**Question Types:**
- `table`: A table grouping multiple related questions
- `number`: A numeric input field
- `enum`: A dropdown/select with predefined options
- `text`: A free-form text input
- `section`: A section header for grouping questions

**Tree Structure:**
Root questions have `relatedQuestionId: null`. Child questions reference their parent via `relatedQuestionId` and are nested in the parent's `relatedQuestions` array.

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm typecheck        # Run TypeScript type checking
pnpm build            # Build for production

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:ui          # Run tests with UI

# Database
docker-compose up -d  # Start database
docker-compose down   # Stop database
pnpm prisma studio    # Open Prisma Studio (database GUI)
pnpm prisma migrate dev # Run migrations
pnpm prisma generate  # Generate Prisma Client

# Data Generation
pnpm tsx scripts/parse-csv.ts  # Regenerate JSON from S1-6.csv
```

## Evaluation Criteria

Your submission will be evaluated on:

1. **Functionality** (40%)
   - Does the form load and display questions correctly?
   - Can users submit answers?
   - Are answers saved to the database?

2. **Code Quality** (30%)
   - Is the code clean, readable, and well-structured?
   - Does it follow the DDD architecture?
   - Is TypeScript used correctly without `any` or `as`?

3. **User Experience** (20%)
   - Is the interface intuitive and user-friendly?
   - Are errors handled gracefully?
   - Is feedback provided to users?

4. **Technical Decisions** (10%)
   - Are architectural choices sound?
   - Is error handling appropriate?
   - Are edge cases considered?

## Questions?

If you have any questions about the requirements or encounter any issues with the setup, please don't hesitate to reach out.

Good luck! We're excited to see your implementation.

---

Built with ❤️ for Kiosk
