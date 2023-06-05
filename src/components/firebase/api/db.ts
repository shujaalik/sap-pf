import { db } from "../index";
import {
  ref as FBRef,
  child,
  get as FBGet,
  DatabaseReference,
  DataSnapshot,
  set as FBSet,
  update as FBUpdate,
} from "firebase/database";

const get = (path: string): Promise<DataSnapshot | any> => {
  return new Promise((resolve, reject) => {
    const dbRef: DatabaseReference = FBRef(db);
    const ref: DatabaseReference = child(dbRef, path);
    FBGet(ref)
      .then((snapshot) => {
        // send recieved snapshot to resolve
        resolve(snapshot);
      })
      .catch((error) => {
        // raise exception
        reject(error);
      });
  });
};

const set = (path: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbRef: DatabaseReference = FBRef(db);
    const ref: DatabaseReference = child(dbRef, path);
    FBSet(ref, data).then(resolve).catch(reject);
  });
};

const update = (path: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbRef: DatabaseReference = FBRef(db);
    const ref: DatabaseReference = child(dbRef, path);
    FBUpdate(ref, data).then(resolve).catch(reject);
  });
};

export { get, set, update };
