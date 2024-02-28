# Fitness App

Welcome to our Fitness App! This application is designed to help users track their fitness journey by providing features such as authentication, viewing courses, workouts, and tracking weights based on user entries.

## Features

- **Authentication**: Users can sign up, log in, and log out securely to access the app's features.
- **Course Viewing**: Users can view available fitness courses to help plan their workouts.
- **Workout Tracking**: Users can track their workouts and monitor their progress over time.
- **Weight Tracking**: Users can log their weight entries and visualize their weight change over time.

## Technologies Used

- **Python Django REST Framework (DRF)**: Backend framework used for building RESTful APIs.
- **Next.js**: React framework used for building the frontend.
- **JWT Authentication**: JSON Web Tokens (JWT) are used for secure authentication.
- **PostgreSQL**: Database management system for storing user data and fitness-related information.
- **Chart.js**: Library used for visualizing weight tracking data.

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/pokhrelgopal/fitness-app-fullstack
   ```

2. **Install dependencies:**

   ```
   cd fitness-app
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

1. Sign up or log in to your account.
2. Explore available fitness courses.
3. Track your workouts by adding entries.
4. Log your weight entries regularly to monitor your progress.
