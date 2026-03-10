# ShelfSafe — Your Smart Home Inventory Manager

A full stack web application for managing household inventory, tracking expiry dates, and reducing waste.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT, bcryptjs

## Features

- Secure sign up and login with JWT authentication
- Add and manage household items across categories
- Real time expiry alerts with color coded urgency
- Dashboard with freshness score and inventory overview
- Insights page with waste overview and category freshness
- Protected API routes using custom JWT middleware

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or use the existing connection)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/ShelfSafe.git
cd ShelfSafe
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Start the app
```bash
npm run dev:all
```

5. Open your browser at
```
http://localhost:8080
```

## Project Structure
```
ShelfSafe/
├── src/              # React frontend
│   ├── pages/        # Dashboard, Alerts, Insights, Auth
│   ├── components/   # Reusable UI components
│   └── lib/          # API store and utilities
├── backend/
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express API routes
│   ├── middleware/   # JWT auth middleware
│   └── server.js     # Express server entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/items | Get all items |
| POST | /api/items | Add new item |
| DELETE | /api/items/:id | Delete item |
| PUT | /api/items/:id | Update item |

## Developer

Built by Anushka as a full stack development project
