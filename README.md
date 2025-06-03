# TaskFlow - Collaborative Task Management Application

A modern task management application built with React.js, Firebase, and Tailwind CSS. Features real-time updates, team collaboration, and progress analytics.

## Features

- User Authentication
- Real-time Task Management
- Team Collaboration
- Progress Analytics
- Modern UI with Tailwind CSS
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Update the configuration in `src/config/firebase.js`

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── components/      # Reusable components
  ├── config/         # Configuration files
  ├── contexts/       # React contexts
  ├── pages/          # Page components
  ├── App.jsx         # Main app component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## Technologies Used

- React.js
- Firebase (Authentication & Firestore)
- Tailwind CSS
- Chart.js
- React Router
- date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.