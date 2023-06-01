import { auth } from "../index";
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";

const login = async (
  email: string,
  password: string,
  remember: boolean,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence,
    )
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // send recieved userCredential to resolve
            resolve(userCredential.user);
          })
          .catch((error) => {
            // raise exception
            reject(error);
          });
      })
      .catch((error) => {
        // raise exception
        reject(error);
      });
  });
};

const user = () => {
  return auth.currentUser;
};

const logout = async () => {
  return new Promise((resolve, reject) => {
    signOut(auth).then(resolve).catch(reject);
  });
};

const forgotPassword = async (email: string) => {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email).then(resolve).catch(reject);
  });
};

export { login, user, logout, forgotPassword };