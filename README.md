# MyNotes App

A modern, full-featured note-taking application that allows users to create, edit, and manage their notes with real-time synchronization. Built with React, TypeScript, and Supabase, this application provides a seamless and secure experience for capturing and organizing thoughts.

## Goal

The goal of MyNotes App is to provide a fast, intuitive, and secure platform for users to write, organize, and access their notes from anywhere. With rich text editing capabilities, dark mode support, and real-time data persistence, users can focus on what matters most—their ideas.

## Features

- **User Authentication**: Secure email/password authentication via Supabase
- **Note Management**: Create, read, update, and delete notes with full CRUD operations
- **Rich Text Editor**: Powered by Tiptap with support for:
  - Text formatting (bold, italic, underline)
  - Text color customization
  - Structured content with headings and lists
- **Dark Mode**: Toggle between light and dark themes for comfortable reading in any environment
- **Real-time Sync**: All changes are automatically saved to the database
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Row-Level Security**: End-to-end encryption of user data with RLS policies ensuring users can only access their own notes
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

### Core Framework
- **React 18**: Modern UI library with hooks and functional components
- **TypeScript**: Static typing for improved code quality and developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend & Database
- **Supabase**: Open-source Firebase alternative providing:
  - PostgreSQL database with Row-Level Security (RLS)
  - Built-in authentication
  - Real-time data synchronization
  - Auto-generated TypeScript types

### Key Libraries & Frameworks

| Library | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.57.4 | Supabase JavaScript client for database and auth |
| `react-router-dom` | ^7.10.1 | Client-side routing and navigation |
| `@tiptap/react` | ^3.13.0 | React integration for Tiptap editor |
| `@tiptap/starter-kit` | ^3.13.0 | Essential Tiptap extensions (bold, italic, etc.) |
| `lucide-react` | ^0.344.0 | Icon library for UI components |
| `sonner` | ^2.0.7 | Toast notifications |

### Development Tools
- **Vitest**: Unit testing framework
- **Testing Library**: React component testing utilities
- **ESLint**: Code linting and quality
- **TypeScript**: Static type checking

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # App header with navigation
│   └── ProtectedRoute.tsx # Protected route wrapper
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Theme state management
├── pages/              # Page components
│   ├── LoginPage.tsx   # User login
│   ├── DashboardPage.tsx # Notes list and overview
│   └── EditorPage.tsx  # Rich text editor for notes
├── services/           # Business logic and API calls
│   └── notes.ts       # Note CRUD operations
├── lib/                # Utilities and configuration
│   └── supabase.ts    # Supabase client setup
├── types/              # TypeScript type definitions
│   └── index.ts       # Shared interfaces
└── App.tsx            # Main app component with routing
```

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Docker & Docker Compose** (optional, for Supabase in Docker)

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mynotes-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can obtain these credentials from:
1. Visit [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Project Settings → API**
4. Copy your `Project URL` and `Anon Key`

### 4. Build the Project

```bash
npm run build
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Other Development Commands

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:run

# Type checking
npm run typecheck

# Linting
npm run lint

# Production preview
npm run preview
```

## Docker Setup

### Using Docker Compose for Supabase

Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  supabase:
    image: supabase/supabase:latest
    ports:
      - "3000:3000"
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: your_secure_password
      JWT_SECRET: your-jwt-secret
      SITE_URL: http://localhost:3000
    volumes:
      - ./supabase:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "5173:5173"
    environment:
      VITE_SUPABASE_URL=http://localhost:3000
      VITE_SUPABASE_ANON_KEY=your-anon-key
    depends_on:
      - supabase
    volumes:
      - .:/app
      - /app/node_modules
```

### Create a Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

The app will be available at `http://localhost:5173` and Supabase at `http://localhost:3000`

## Database Schema

The application uses a single main table for note management:

### Notes Table
```sql
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

- **Row-Level Security (RLS)**: Enabled to ensure users can only access their own notes
- **Indexed on user_id**: For optimized query performance

## Testing

The project includes comprehensive test coverage using Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test -- --coverage
```

Tests are located in `__tests__` directories throughout the project structure.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Node.js applications (Netlify, AWS, Heroku, etc.). Ensure environment variables are properly configured on your deployment platform.

## Security Considerations

- All user data is protected by Supabase's Row-Level Security (RLS)
- Authentication tokens are managed securely via Supabase
- Sensitive environment variables are never exposed to the client (prefix with `VITE_`)
- Regular security audits are recommended

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- Tests are included for new features
- TypeScript types are properly defined
- ESLint passes without warnings

## License

MIT
