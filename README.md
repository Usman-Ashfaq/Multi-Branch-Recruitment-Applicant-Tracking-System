# ATSRecruit — Multi-Branch Recruitment & Applicant Tracking System

A full-stack MERN application for managing recruitment across multiple branches with role-based access for candidates and HR managers.

## Tech Stack

- **Frontend:** React.js (Vite), React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **File Upload:** Cloudinary (multer + multer-storage-cloudinary)
- **Email:** Nodemailer with Gmail SMTP

## Features

- Multi-branch job listings (Islamabad, Lahore, Karachi, Remote)
- Candidate registration, profile management, and job application with file uploads
- HR dashboard with stats, job management, and applicant tracking
- Application status workflow: Submitted → Under Review → Shortlisted → Interview Scheduled → Selected/Rejected
- Automated email notifications (shortlist, rejection, interview invitation)
- Custom email messaging from HR to candidates
- Interview scheduling with email notifications
- Role-based access control (Candidate, HR, Admin)

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Gmail account with App Password enabled

### 1. Clone the repository
```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create/edit `.env` file with your values:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Backend server port (default: 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT token signing |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| GMAIL_USER | Gmail address for sending emails |
| GMAIL_PASS | Gmail app password |
| FRONTEND_URL | Frontend URL for CORS |

## API Endpoints

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| PATCH | /api/auth/profile | Authenticated |
| GET | /api/branches | Public |
| POST | /api/branches | HR/Admin |
| DELETE | /api/branches/:id | HR/Admin |
| GET | /api/jobs | Public |
| GET | /api/jobs/:id | Public |
| POST | /api/jobs | HR/Admin |
| PUT | /api/jobs/:id | HR/Admin |
| DELETE | /api/jobs/:id | HR/Admin |
| POST | /api/applications | Candidate |
| GET | /api/applications/my | Candidate |
| GET | /api/applications/job/:jobId | HR/Admin |
| PATCH | /api/applications/:id/status | HR/Admin |
| POST | /api/interviews | HR/Admin |
| GET | /api/interviews/my | Candidate |
| GET | /api/interviews | HR/Admin |
| GET | /api/hr/applicants | HR/Admin |
| POST | /api/hr/message | HR/Admin |

## Deployment URLs

- **Frontend:** _[placeholder]_
- **Backend:** _[placeholder]_

