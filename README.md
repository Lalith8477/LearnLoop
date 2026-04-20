# LearnLoop - Daily Learning Intelligence System

## Problem Statement

Every day, people consume vast amounts of information through coding tutorials, reading documentation, and online courses. However, there are significant challenges associated with this unstructured learning process. Knowledge becomes highly fragmented because there is no centralized, structured way to capture fleeting insights. Without a system for spaced repetition or periodic review, a large percentage of what is learned is quickly forgotten. Furthermore, self-learners lack tangible metrics to track their consistency, daily habits, or the actual time they have invested into studying specific topics.

**Solution:**
LearnLoop solves this by providing a unified, high-performance Learning Intelligence System. It functions as a daily habit tracker combined with a robust knowledge vault. The application allows users to capture their daily insights, organize them with custom tags, track their learning streaks to build consistency, visualize their time investments on an analytics dashboard, and utilize a dedicated Review Queue to compound their knowledge over time through spaced repetition.

## Features

- **Authentication System:** Secure user authentication using Firebase Auth (Email/Password and Google Sign-In) with persistent, protected sessions.
- **Learning Entry System (CRUD):** A comprehensive system where users can create, read, update, and delete their daily learning logs.
- **Intelligence Dashboard:** A dynamic analytics dashboard featuring data visualizations of Total Learnings, Current Streak tracking, and Total Time Invested.
- **Knowledge Vault:** A chronological timeline of all learning entries with real-time tag filtering and categorization.
- **Review Queue:** A spaced repetition feature where users can mark complex topics as "Needs Revision" and access them later in a dedicated queue.
- **Focus Timer:** A built-in Pomodoro timer with customizable durations that transitions seamlessly into the entry logging process to ensure time spent is accurately recorded.

## Tech Stack

- **Frontend:** React 19, Vite, React Router v7
- **State Management:** React Context API, Custom Hooks
- **Performance Optimization:** `useMemo` for heavy chart calculations, `useCallback`, `React.lazy`, `Suspense` for routing
- **Backend & Database:** Firebase Authentication, Cloud Firestore (NoSQL Database)
- **Styling & UI:** Vanilla CSS with custom CSS variables, Recharts for dynamic data visualization

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
