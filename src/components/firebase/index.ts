import { initializeApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { firebaseConfig } from "./config";
import { getAuth } from "firebase/auth";

// initialize firebase
const app = initializeApp(firebaseConfig);

// firebase components
const db: Database = getDatabase(app);
const auth = getAuth();

// export firebase components
export { db, auth };