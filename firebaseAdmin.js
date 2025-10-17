import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Path to your downloaded JSON key
const serviceAccountPath = path.resolve("./serviceAccountKey.json");

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
