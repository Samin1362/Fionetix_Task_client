import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDn6UxMD-mUxfNDxdo6uaX-gv75jjYzYc",
  authDomain: "fionetix-task-project.firebaseapp.com",
  projectId: "fionetix-task-project",
  storageBucket: "fionetix-task-project.firebasestorage.app",
  messagingSenderId: "49407741993",
  appId: "1:49407741993:web:0ed1959fde2d5d034c8c38"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
