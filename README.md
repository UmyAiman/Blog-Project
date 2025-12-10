📝 Blog Management System (Node + Express + MongoDB)

A complete Blog Application built using Node.js, Express.js, MongoDB, and EJS.
It includes a public blog website and a secure Admin Panel for managing posts.
Admins can create, edit, delete, and search blog posts with a clean and simple UI.

✨ Features
🌐 Public Blog
View all posts
Read single post pages
Responsive layout
Clean UI with EJS

🛡️ Admin Panel
Secure JWT-based login
Dashboard for managing posts
Add New Post
Edit Existing Post
Delete Post
Live Search Functionality

Protected routes: only logged-in admins can access
⚙️ Additional Features
Custom EJS layouts
Custom CSS styling
Method override for updating and deleting
Organized folder structure suitable for recruiters

🧰 Tech Stack
Frontend: EJS, HTML, CSS
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JWT + Cookies
Other Tools: dotenv, method-override, bcrypt

⚙️ How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/umy-aiman/Blog-Project.git
cd blog-project

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=3000

4️⃣ Run the project
npm start
Your app will run on:
👉 http://localhost:3000

🔒 Admin Workflow
Admin logs in using email + password
Token is stored for authentication
Admin can now access:
/admin/dashboard
/admin/add-post
/admin/edit-post/:id

Admin can:
Add Post
Edit Post
Delete Post
Search Posts from navbar

Delete Post

Search Posts from navbar
