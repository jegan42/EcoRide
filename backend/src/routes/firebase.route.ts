// backend/src/routes/firebase.route.ts
import express from 'express';
import { getAuth } from '../firebase/firebaseAdmin';
import { authenticate } from '../middleware/auth.middleware';
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
} from '../utils/response';

interface User {
  id?: string;
  email?: string;
}

const router = express.Router();
router.get('/', authenticate, (req, res, next) => {
  (async () => {
    try {
      const user = req.user as User;
      if (!user?.id) {
        unauthorizedResponse(res, 'Firebase', 'user not authentify');
        return;
      }
      const token = await getAuth().createCustomToken(user.id);
      successResponse(res, 'Firebase', 'getFirebaseToken', { token });
    } catch (error) {
      console.error('[FirebaseToken]', error);
      errorResponse(res, 'Firebase', 'failed to getFirebaseToken', error);
    }
  })().catch(next);
});

export default router;
