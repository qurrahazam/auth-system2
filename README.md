### Next.js Authentication System

A **compact authentication module** built with **Next.js (App Router)** and **MongoDB**.  
It includes signup/login/logout, email verification, password reset, and password change — all using JWT stored in secure HttpOnly cookies.  
Intended as a lightweight, drop-in starting point for full-stack Next.js apps.

## Key Points
- **Next.js (App Router)** with Route Handlers for API endpoints.  
- **MongoDB** via Mongoose (`lib/db.ts`).  
- **JWT authentication** stored in HttpOnly cookies for session handling.  
- **Email verification** and password reset through secure token links.  
- **Reusable validation** shared between frontend and backend.  
- **Soft emerald-green + white UI** built with Tailwind CSS.

## Project Structure
```bash
app/              — pages and API route handlers (app/api/auth/*/route.ts)
lib/              — db.ts for MongoDB connection + JWT helpers
models/           — User.ts Mongoose model
schemas/          — validation schemas used by routes
components/       — reusable UI components (forms, inputs, etc.)

````

## Quick Start (Development)
### Install Dependencies
```bash
npm install
````

### Create `.env.local`
```env
MONGODB_URI= "Your-mongo-connection-string"
JWT_SECRET=your_jwt_secret
RESEND_API_KEY= - 
FRONTEND_URL=http://localhost:3000
```

### Run the App
```bash
npm run dev
```

## API Endpoints (app/api/auth)
| Method | Endpoint                    | Description                                     |
| ------ | --------------------------- | ----------------------------------------------- |
| `POST` | `/api/auth/signup`          | Register a new user (email, username, password) |
| `POST` | `/api/auth/login`           | Authenticate and set HttpOnly JWT cookie        |
| `POST` | `/api/auth/logout`          | Clear authentication cookie                     |
| `POST` | `/api/auth/verify`          | Verify user email using token                   |
| `POST` | `/api/auth/forgot-password` | Send password reset link                        |
| `POST` | `/api/auth/reset-password`  | Reset password using token                      |
| `POST` | `/api/auth/change-password` | Change password for logged-in user              |
| `GET`  | `/api/auth/me`              | Fetch the authenticated user from JWT cookie    |


## How Email Verification & Reset Work
* `/api/auth/forgot-password` or `/api/auth/verify` generates a short-lived JWT signed with `JWT_SECRET`.
* The link is built using `NEXT_PUBLIC_APP_URL`, for example:
  ```
  https://yourapp.com/reset-password?token=...
  ```
* The email is sent using **Resend** or SMTP settings defined in `.env.local`.

## Security Notes
* Passwords are hashed using **bcrypt** before saving to the database.
* JWTs are stored in **HttpOnly cookies** for secure session handling.
* Tokens expire automatically and are validated on every request.
* Unverified accounts can be auto-deleted after an hour.
* Validation ensures consistent input checks on both frontend and backend.

## Developer Notes & Next Steps
* `lib/db.ts` reuses Mongo connection in dev mode to prevent multiple instances.
* Add **rate limiting** to signup/login routes.
* Add **OAuth providers (Google, GitHub)** for social login.
* Add **API route tests** for signup/login/reset flows.

## Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

## Troubleshooting
* **MongoDB connection errors:** verify `MONGODB_URI` and cluster access.
* **Emails not sending:** check your SMTP or Resend API credentials.
* **JWT expired / invalid:** ensure `JWT_SECRET` and `JWT_EXPIRY` are correct.
* **Reset links invalid:** verify that `NEXT_PUBLIC_APP_URL` matches your deployed URL.
