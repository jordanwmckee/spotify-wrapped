import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  SnapshotMetadata,
} from "firebase/firestore";
import { spotifyApi } from "./spotify";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuAWyQ46gU_8ni0eVXoJmFwRWkxpYaQ-w",
  authDomain: "wrapped-monthly.firebaseapp.com",
  projectId: "wrapped-monthly",
  storageBucket: "wrapped-monthly.appspot.com",
  messagingSenderId: "942348827229",
  appId: "1:942348827229:web:50ea06f23ef961ca4b6bb4",
  measurementId: "G-LEGN65BPPK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
				refreshToken: "",
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
	  	refreshToken: "",
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  spotifyApi.setAccessToken(null);
  signOut(auth);
};

const getUserDoc = async (user) => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  } catch (err) {
    console.error(err);
  }
}

const checkForToken = async (user) => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.data().refreshToken === "") return false;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const getRefreshToken = async (user) => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const res = await getDoc(docRef);
    return res.data().refreshToken;
  } catch (err) {
    console.error(err);
  }
}

const addTokenToDb = async (data, user) => {
  if (!data || !user) return;
  await updateDoc(doc(db, "users", user?.uid), { refreshToken: data })
    .then(() => { 
      console.log("user tokens updated") 
    })
    .catch(err => { 
      console.error("error updating user tokens: ", err);
    });
}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUserDoc,
  checkForToken,
  getRefreshToken,
  addTokenToDb,
};