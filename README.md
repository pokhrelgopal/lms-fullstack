# Learning Management System

Welcome to our Learning Management System (LMS)! This comprehensive platform is designed to facilitate learning and teaching online, offering features such as course enrollment, payment gateway integration, certificate generation, course creation, sections, modules, quizzes, and user authentication and authorization.

## Features

- **Authentication and Authorization**: Secure sign-up, log-in, and role-based access control for teachers and students.
- **Course Management**: Teachers can create, manage, and publish courses with sections, modules, and quizzes.
- **Course Enrollment**: Students can browse available courses and enroll in them.
- **Payment Gateway Integration**: Seamless payment processing using Khalti for course enrollment fees.
- **Certificate Generation**: Upon course completion, certificates are generated using Pillow library and presented to students.
- **UI with Tailwind CSS**: Stylish and responsive user interface built with Tailwind CSS.
- **Teacher Mode and Student Mode**: Different interfaces and functionalities tailored for teachers and students.

## Technologies Used

- **Python Django REST Framework (DRF)**: Backend framework for building RESTful APIs.
- **Next.js**: React framework for building the frontend.
- **JWT Authentication**: JSON Web Tokens for secure authentication.
- **PostgreSQL**: Database management system for storing user data and course information.
- **Khalti API**: Payment gateway integration for processing transactions.
- **Pillow**: Python Imaging Library for certificate generation.
- **Tailwind CSS**: Utility-first CSS framework for styling the user interface.

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/pokhrelgopal/lms-fullstack
   ```

2. **Install dependencies:**

   ```
   cd lms
   npm install  # Install frontend dependencies
   pip install -r requirements.txt  # Install backend dependencies
   ```

3. **Run migrations:**

   ```
   python manage.py migrate
   ```

4. **Start the development server:**

   ```
   npm run dev  # Start frontend development server
   python manage.py runserver  # Start backend development server
   ```

5. **Access the application at** `http://localhost:3000`.

## Usage

1. **Sign up or log in** as a teacher or student.
2. **Create or enroll in courses** based on your role.
3. **Browse course content**, including sections, modules, and quizzes.
4. **Complete course requirements** and **generate certificates** upon completion.
