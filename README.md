# TaskFlow - Collaborative Task Management Application

A modern task management application built with React.js, Firebase, and Tailwind CSS. Features real-time updates, team collaboration, and progress analytics.

## ✨ Features

- **Real-time Updates**: Live synchronization across all team members
- **User Authentication**: Secure Firebase Authentication
- **Project Management**: Create, update, and track project progress
- **Task Management**: Assign, complete, and organize tasks
- **Team Collaboration**: Invite team members and collaborate in real-time
- **Real-time Notifications**: Get instant updates on project changes
- **Progress Analytics**: Track completion rates and productivity
- **Modern UI**: Beautiful interface with Tailwind CSS
- **Responsive Design**: Works on all devices

## 🚀 Real-time Features

- **Live Project Updates**: See project changes instantly across all team members
- **Real-time Task Synchronization**: Task status updates appear immediately
- **Live Notifications**: Get notified when tasks are assigned or projects are updated
- **Collaborative Editing**: Multiple users can work on the same project simultaneously
- **Instant Progress Tracking**: Progress bars update in real-time

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🛠️ Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd task-management-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Firebase:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Create a `.env.local` file in the root directory with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Set up Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read/write projects they're members of
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
    }
    
    // Allow users to read/write tasks assigned to them
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.assignedTo || 
         request.auth.uid == resource.data.createdBy);
    }
    
    // Allow users to read/write their own notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

5. **Start the development server:**
```bash
npm run dev
```

## 📁 Project Structure

```
src/
  ├── components/      # Reusable components
  ├── config/         # Configuration files (Firebase)
  ├── contexts/       # React contexts (Auth)
  ├── pages/          # Page components
  ├── services/       # Firebase service functions
  │   ├── projectService.js    # Real-time project operations
  │   ├── taskService.js       # Real-time task operations
  │   └── notificationService.js # Real-time notifications
  ├── App.jsx         # Main app component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## 🔧 Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Real-time**: Firebase Firestore onSnapshot listeners
- **Charts**: Chart.js, React Chart.js 2
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **Drag & Drop**: React Beautiful DnD

## 🔄 Real-time Architecture

The app uses Firebase Firestore's real-time listeners to provide instant updates:

- **Projects**: `onSnapshot` listeners for project changes
- **Tasks**: Real-time task status updates
- **Notifications**: Live notification delivery
- **Team Management**: Instant team member updates

## 🚀 Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions about the real-time features, please:

1. Check the Firebase Console for any errors
2. Verify your Firestore security rules
3. Ensure your Firebase configuration is correct
4. Check the browser console for any JavaScript errors

## 🔮 Future Enhancements

- Real-time chat within projects
- File upload and sharing
- Advanced analytics and reporting
- Mobile app (React Native)
- Integration with third-party tools