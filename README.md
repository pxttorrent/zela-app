<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ossaVtcRzpXkM0Jq8rrJRYtruVWGtWEe

## Run Locally

**Prerequisites:**  Node.js, PostgreSQL

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if available) or create `.env`.
   - Set `GEMINI_API_KEY`, `DATABASE_URL` (for PostgreSQL), and other required variables.

3. Run Database Migrations:
   ```bash
   npm run migrate
   ```

4. Run the app (Development):
   
   Start the backend server (runs on port 3002):
   ```bash
   npm run dev:server
   ```

   Start the frontend (runs on port 3000):
   ```bash
   npm run dev
   ```

## Testing

To run the test suite (Unit and Integration):

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Scripts

- `npm run dev`: Start frontend dev server
- `npm run dev:server`: Start backend dev server
- `npm run build`: Build frontend and backend
- `npm run start`: Start production server
- `npm run migrate`: Run database migrations
- `npm test`: Run tests
- `npm run lint`: Run linter
