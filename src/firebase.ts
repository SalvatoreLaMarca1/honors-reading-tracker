// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl8O2n8kmLT51pZEbEfscRy9ZcY8mW61Q",
  authDomain: "reading-habit-tracker-website.firebaseapp.com",
  projectId: "reading-habit-tracker-website",
  storageBucket: "reading-habit-tracker-website.firebasestorage.app",
  messagingSenderId: "925605783685",
  appId: "1:925605783685:web:c693560fa19431b18621ec",
  measurementId: "G-RVD2K8L3CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const usersCollectionRef = collection(db, 'users');

export interface User {
  email: string;
  password: string;
}

// Retrieve documents from users
export const getData = async (): Promise<User[]> => {
  const snapshot = await getDocs(usersCollectionRef)

  const users: User[] = [];

  snapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data())
    users.push(doc.data() as User)
  })

  console.log(users)

  return users;
}

// Call the function now
//getData();