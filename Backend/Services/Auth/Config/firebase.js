import admin, { cert, initializeApp } from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with  {type:"json"};

export const app = initializeApp({
  credential: admin.cert(serviceAccount)
});

