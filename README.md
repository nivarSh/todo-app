# DeepWork: Science-based tool aimed at enhancing productivity.

## Science-based Philosophy
The goal of DeepWork is to help users define a clear set of tasks and assign themselves focused time blocks to complete them efficiently.

- Timed Focus Sessions: The app encourages users to complete tasks within a self-imposed time limit, creating a game-like challenge. This design is inspired by Parkinson’s Law, which states:
“Work expands to fill the time available for its completion.”
By setting strict time constraints, users are less likely to procrastinate or overwork tasks, promoting sharper focus and quicker decision-making.
- Visual Progress Tracking: After completing a session, users can log their work. These logs are visualized in a weekly line graph, providing clear feedback and reinforcing progress. This visual accountability helps build consistency and gives users insight into their productivity habits over time.

## Basic Overview
DeepWork is a science-inspired productivity web application that helps users focus, track, and visualize their work sessions. Users can create daily tasks, set customizable timers to work in focused intervals, and log their completed sessions. The app provides visual insights into productivity trends across the week, helping users build better habits and stay accountable. Whether you're a student, remote worker, or just looking to improve focus, DeepWork is a simple yet powerful tool for structured deep work.

## Technical Functionality
##### Frontend:
- Built with React and modular component architecture.
- Uses useState and useEffect for local state management.
- LocalStorage persists todos across sessions.
- axios handles API requests with cookies (withCredentials: true) for session-based auth.
- react-router-dom manages routing between views.
- Recharts renders weekly productivity graphs.

##### Backend:
- Developed with Flask and deployed on Render.
- Session-based authentication using secure cookies.
- Secure password hashing for user auth.
- API ROUTES:
  - POST /signup
  - POST /login
  - POST /logout
  - GET /me
  - POST /work_logs
  - GET /work_logs/weekly
  - GET /work_logs/history
- Postgres database with users table and work_logs.

## Future Improvements
- Option to edit todo content and reorder the vertical position of todos
- Option to create subtasks for each todo
- Section for youtube embedded music to play: will curate playlist based on different moods: classical, creative, fun, etc.

## Hosting
- Frontend: hosted using Vercel free plan
- Backend: hosted with Render flask and Render Postgres database

`currently reworking app to handle hosting. Current struggles are reworking app to handle render's free plans. Persisting session storage even if backend is shut down due to inactivity.`

This version below is a frontend-only version that leverages localStorage to store study data. Frontend only apps are free to host with vercel.
[https://todo-app-client-ten.vercel.app/](https://todo-app-nivar.vercel.app/)
