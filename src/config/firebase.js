import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyAkE7-V4y2is8tLz0gXvnQzm1tExek2l4M",
    authDomain: "chat-app-gs-f1d82.firebaseapp.com",
    projectId: "chat-app-gs-f1d82",
    storageBucket: "chat-app-gs-f1d82.appspot.com",
    messagingSenderId: "1008656844280",
    appId: "1:1008656844280:web:43197015b4a319a83ec20d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const signup = async (username, email, password) => {

    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email: email,
            name: "",
            avatar: "",
            bio: "Hey , There i am using chat app",
            lastSeen: Date.now()
        })

        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })

    } catch (error) {
        console.error(error);
        toast.error(error.code);
    }
}


const login = async (email, password) => {

    try {

        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        toast.error(error.code);
    }
}

const logout = async () => {
    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);
        toast.error(error.code);
    }
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {

        const userRef = collection(db, 'users');

        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent to your registered email")
        } else {
            toast.error("Email doesn't exists")
        }

    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }

}


export { signup, login, logout, auth, db, resetPass }