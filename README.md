### Student Course Enrollment System

A full-stack web application that allows students to enroll in courses, manage enrollment status, and enables admins to create and manage courses.
Built using FastAPI (Backend) and React + TypeScript (Frontend) with clean architecture and validations.

### Tech Stack
## Backend

-- FastAPI
-- SQLAlchemy
-- Pydantic v2
-- SQLite

## Frontend

-- React
-- TypeScript
-- Plain CSS

## Project Structure
```
stu_course_enrol/
│
├── backend/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── routers/
│   ├── main.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Backend API Endpoints

# Courses
POST    /courses
GET     /courses
GET     /courses/{id}
PUT     /courses/{id}
DELETE  /courses/{id}

# Enrollments
POST    /enrollments
GET     /enrollments
PATCH   /enrollments/{id}/status

## Backend Setup
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```
## Frontend Setup
```
cd frontend
npm install
npm run dev
```
