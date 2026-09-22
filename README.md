# Verdant Haven

Verdant Haven is a full-stack plant nursery and gardening e-commerce application built with React on the frontend and Node.js + Express + MongoDB on the backend.

## Project Overview

This project allows users to:
- browse plants and categories
- register/login to the application
- place plant orders
- view order history
- add product reviews
- manage admin plant inventory and customer orders

## Resume-Friendly Project Name

- Repository name: verdant-haven
- Project title: Verdant Haven
- Short tagline: Full Stack Plant Store Management System

## Tech Stack

Frontend
- React + Vite
- Redux Toolkit
- React Router DOM
- Axios
- CSS

Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS

## Project Structure

```text
GreenGardenApp/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
├── README.md
└── .git
```

## Prerequisites

- Node.js v18+
- npm
- MongoDB running locally or a MongoDB Atlas connection

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update the backend `.env` file with your MongoDB connection string and secret key.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend is configured to talk to the backend at `http://localhost:8080`.

## Default Backend URL

```text
http://localhost:8080
```

## GitHub Repository Setup

1. Create a new empty repository on GitHub.
2. In the project root run:

```bash
git init -b main
git add .
git commit -m "Initial project setup"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Notes

- Keep `.env` files local and never push them to GitHub.
- The project is already structured as a single full-stack repository with separate frontend and backend folders.
- This is suitable for showcasing in a portfolio or resume as a full stack web application.

## Future Enhancements

- add payment integration
- add admin analytics dashboard
- deploy frontend and backend separately
- add image upload support
- add product search and filters
