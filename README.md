# College Event Management System
 
A full-stack web application designed to streamline the creation, management, and discovery of college events, club activities, and society workshops.
 
## 🚀 Features
 
- **Role-Based Access Control (RBAC):** Secure access for Admins, Society/Club Coordinators (SoC), and general users.
- **Dashboard:** A responsive dashboard featuring an auto-playing carousel for featured active events, with a searchable, and filterable event feed allowing users to sort by activity points, fees, organizers, and dates.
- **Secure Authentication:** Custom JWT-based authentication with automated frontend session management and auto-logout.
- **Automated Email Notifications:** Secure OTP delivery and account creation alerts using	 nodemailer.
- **Event Management:**
  - **Create:** Add new events with integrated poster image uploads.
  - **Update:** Allowing coordinators to update details, add post-event descriptions, and manage event statuses.
  - **Delete:** Secure deletion of events.
- **User Management (Admin Panel):** Dedicated interfaces for Admins to register and delete accounts for other Admins, Societies, and Clubs.

## 🛠️ Tech Stack
 
- **Frontend:** React.js, Tailwind CSS, Swiper.js, Lucide Icons
- **Backend:** Node.js, Express.js, Nodemailer
- **Database:** MongoDB
- **Security & Auth:** JSON Web Tokens (JWT)
- **File Handling:** Multer
 
## ⚙️ Installation & Setup
 
- Install Frontend Dependencies:
```
cd frontend
npm install
```

- Install Backend Dependencies:
```
cd backend
npm install
```
- Database Configuration:
  - Setup MongoDB cluster
  - Add your connection string in `db.js`

- Run the Application:
  - Start the backend server: `nodemon index.js` (inside the backend folder)
  - Start the frontend server: `npm run dev` (inside the frontend folder)
