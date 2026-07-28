# Prep Dashboard (Striver A2Z DSA Sheet)

A full-stack web application for tracking and preparing DSA problems based on Striver's A2Z DSA Sheet.

## Project Structure

- `backend/`: Node.js Express server with MongoDB integration.
- `frontend/`: React application built with Vite and styled with custom Fluent design aesthetics.
- `strivers_a2z_sheet.json`: The raw JSON data containing the DSA sheet questions and topics.

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Run `npm install`
3. Configure your `.env` file (set up port and MongoDB connection URI)
4. Seed the database (optional): `npm run seed`
5. Run in dev mode: `npm run dev`

### Frontend
1. Navigate to `frontend/`
2. Run `npm install`
3. Run the development server: `npm run dev`
