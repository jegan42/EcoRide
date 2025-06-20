// backend/src/firebase/firebaseAdmin.ts
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

let app: App | undefined;

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY_JSON ?? '{}');

  app = initializeApp({
    credential: cert(serviceAccount),
  });
}

export const getAuth = () => getAdminAuth(app);
