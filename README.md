Blog Management System (MERN Backend + EJS Frontend)

A full-stack Blog Management System built using Node.js, Express.js, MongoDB, and EJS.
The application provides a public-facing blog platform along with a secure admin dashboard that allows administrators to manage blog content efficiently.
This project demonstrates backend development skills, authentication, role-based access control, and RESTful architecture.

🚀 Key Features
Public Blog
View all published blog posts
Read individual blog posts
Clean and responsive user interface
Server-side rendering using EJS templates

Admin Panel
Secure JWT-based authentication
Admin-only protected routes
Create, edit, and delete blog posts
Live search functionality for posts
Centralized dashboard for content management

🔐 Security & Authentication
JWT authentication with HTTP-only cookies
Password hashing using bcrypt
Protected routes accessible only to authenticated admins

🧰 Tech Stack
Frontend
EJS
HTML5
CSS3
Backend
Node.js
Express.js
Database
MongoDB (Mongoose ODM)
Authentication & Tools
JSON Web Tokens (JWT)
bcrypt
dotenv
method-override

📁 Project Structure
The project follows a clean and organized folder structure to ensure scalability and maintainability:

routes/
controllers/
models/
views/
public/
middleware/

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/UmyAiman/Blog-Project
cd blog-project

2. Install Dependencies
npm install
3. Environment Variables
Create a .env file in the root directory and add:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000

4. Run the Application
npm start
The application will run at:
http://localhost:3000
🔑 Admin Workflow

Admin logs in using email and password
JWT token is generated and stored securely
Admin gains access to protected routes:
/admin/dashboard
/admin/add-post
/admin/edit-post/:id
Admin can:
Add new posts
Edit existing posts
Delete posts

Search posts using the navbar
