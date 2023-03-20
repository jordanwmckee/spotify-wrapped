import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
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
  deleteDoc,
  DocumentData,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuAWyQ46gU_8ni0eVXoJmFwRWkxpYaQ-w",
  authDomain: "wrapped-monthly.firebaseapp.com",
  projectId: "wrapped-monthly",
  storageBucket: "wrapped-monthly.appspot.com",
  messagingSenderId: "942348827229",
  appId: "1:942348827229:web:50ea06f23ef961ca4b6bb4",
  measurementId: "G-LEGN65BPPK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Authenticate user through google and grab info for Firebase
 */
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
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Authorize user given email & password credentials
 *
 * @param {string} email
 * @param {string} password
 * Values from Login form
 */
const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Create an account and add information to Firebase
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * Values from Register form
 */
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
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
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Send a password reset link to email address
 *
 * @param {string} email Retrieved from Reset form
 */
const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Logout and unauthenticate user from app
 */
const logout = () => {
  signOut(auth);
};

/**
 * Get the firebase doc containing this user's info
 *
 * @param {User} user Returned from useAuthState
 * @returns {DocumentData} A reference to the users doc
 */
const getUserDoc = async (user: User): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const snapshot = await getDoc(docRef);
    return Promise.resolve(snapshot.data()!);
  } catch (err: any) {
    console.error(err);
  }
  return Promise.resolve(null);
};

/**
 * Remove user's refresh token from firebase
 *
 * @param {User} user Returned from useAuthState
 */
const unlinkSpotify = async (user: User) => {
  try {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, { refreshToken: "" });
  } catch (err: any) {
    console.error(err);
  }
};

/**
 * Delete user account
 *
 * @param {User} user Returned from useAuthState
 */
const removeUser = async (user: User) => {
  try {
    console.log("user: ", user);
    console.log("id: ", user?.uid);
    const docRef = doc(db, "users", user?.uid);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error(err);
  }
};

/**
 * Check for existing refresh token in user db
 *
 * @param {User} user Returned from useAuthState
 * @returns {bool} True if token exists, False if it is unset
 */
const checkForToken = async (user: User): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.data()?.refreshToken !== "") return Promise.resolve(true);
  } catch (err: any) {
    console.error(err);
  }
  return Promise.resolve(false);
};

/**
 * Fetch Refresh Token from user db
 *
 * @param {User} user Returned from useAuthState
 * @returns {string} Refresh token value
 */
const getRefreshToken = async (user: User): Promise<string | null> => {
  try {
    const docRef = doc(db, "users", user?.uid);
    const res = await getDoc(docRef);
    return Promise.resolve(res.data()?.refreshToken);
  } catch (err: any) {
    console.error(err);
  }
  return Promise.resolve(null);
};

/**
 * Sets value of refresh token (stored in data var) in user db
 *
 * @param {string} data The refresh token
 * @param {User} user Returned from useAuthState
 */
const addTokenToDb = async (data: string, user: User) => {
  if (!data || !user) return;
  await updateDoc(doc(db, "users", user?.uid), { refreshToken: data })
    .then(() => {
      console.log("Refresh token added to user store");
    })
    .catch((err) => {
      console.error("Error storing user refresh token: ", err);
    });
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUserDoc,
  unlinkSpotify,
  removeUser,
  checkForToken,
  getRefreshToken,
  addTokenToDb,
};
