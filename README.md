# OpportunityHub – Internship & Job Portal

OpportunityHub is a full-stack web application designed to connect job seekers, students, and fresh graduates with internship and job opportunities. It provides a centralized platform where candidates can create profiles, explore opportunities, submit applications, and track their application status.

The platform also provides an admin dashboard to manage job opportunities and candidate applications efficiently.

## 🚀 Features

### 👨‍🎓 Candidate Features
- User registration and login.
- Secure authentication using JWT.
- Personalized candidate dashboard.
- Create and update candidate profile.
- Add educational details, including:
  - College name
  - University name
  - Degree
  - Graduation year
  - 10th marks
  - 12th marks
  - Graduation marks
- Add contact details and preferred job information.
- Upload or provide a resume link.
- Browse available internships and job opportunities.
- Search opportunities by title or keyword.
- Filter opportunities based on domain or job type.
- View complete opportunity details.
- Apply for available opportunities.
- Track submitted applications and their status.

### 👨‍💼 Admin Features
- Secure admin login.
- Admin dashboard.
- Add new job and internship opportunities.
- Edit existing opportunities.
- Delete opportunities.
- View candidate applications.
- Access candidate application details.
- Review candidate resumes.
- Update application status.
- Manage recruitment activities.

### 📩 Application Management
- Candidates can submit applications through the portal.
- Applications are associated with the respective candidate and opportunity.
- Admin can view submitted applications.
- Admin can update application status, such as Pending, Shortlisted, Rejected, or other configured statuses.
- Candidates can track their application progress.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Tailwind CSS | UI styling and responsive design |
| Lucide React | Icons |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| JWT | Authentication |
| Axios | API communication |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
internship-job-portal/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/internship-job-portal.git
```

### 2. Navigate to the Project Folder

```bash
cd internship-job-portal
```

### 3. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

Add any other environment variables required by your backend configuration.

Start the backend server:

```bash
npm start
```

If you use Nodemon:

```bash
nodemon server.js
```

### 4. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
"http://localhost:5173"
```

## 🔗 API Overview

The backend provides REST APIs for the following operations:

| Module | Endpoint | Method |
|---|---|---|
| Authentication | `/api/auth/...` | POST |
| Opportunities | `/api/opportunities` | GET / POST |
| Applications | `/api/applications` | GET / POST |
| Student Profile | `/api/profile/me` | GET |
| Student Profile | `/api/profile/me` | PUT |

*Note: Authentication and opportunity endpoints may include additional routes depending on your backend implementation.*

## 🗄️ Database Collections

The application uses MongoDB to store information.

- **users:** Stores registered candidate and admin account information.
- **studentProfiles:** Stores individual candidate profile and educational details.
- **opportunities:** Stores job and internship information.
- **applications:** Stores candidate applications and their statuses.
- **admin:** Stores admin-related data, if configured in the application.

Each candidate's profile is associated with their user ID to keep individual profile information separate.

## 🔐 Security
- JWT-based authentication.
- Protected backend routes.
- Role-based access for candidate and admin features.
- Environment variables for sensitive configuration.
- `.env` files excluded from Git using `.gitignore`.

## 🎯 Project Objectives

1. Provide a centralized platform for finding internships and jobs.
2. Simplify the application process for students and fresh graduates.
3. Allow candidates to maintain their professional profiles.
4. Help administrators manage opportunities and applications.
5. Provide transparency through application status tracking.
6. Improve communication between candidates and recruiters.

## 🔮 Future Enhancements
- Automated email notifications for application updates.
- Resume parsing and skill extraction.
- AI-based job recommendations.
- Advanced job filtering.
- Interview scheduling.
- Real-time application notifications.
- Analytics dashboard for administrators.

## 👨‍💻 Author

**Project Name:** OpportunityHub – Internship & Job Portal

**Project Type:** Full-Stack Web Application

**Technologies:** React.js, Tailwind CSS, Node.js, Express.js, MongoDB

---

⭐ If you find this project useful, consider giving it a star on GitHub.