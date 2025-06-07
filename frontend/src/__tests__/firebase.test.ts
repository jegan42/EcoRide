// frontend/src/__tests__/firebase.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => 'mocked-app'),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mocked-db'),
}));

describe('Firebase initialisation', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.FIREBASE_APIKEY = 'test-key';
    process.env.FIREBASE_AUTHDOMAIN = 'test-auth-domain';
    process.env.FIREBASE_PROJECTID = 'test-project-id';
    process.env.FIREBASE_STORAGEBUCKET = 'test-storage-bucket';
    process.env.FIREBASE_MESSAGINGSENDERID = 'test-sender-id';
    process.env.FIREBASE_APPID = 'test-app-id';
    process.env.FIREBASE_MEASUREMENTID = 'test-measurement-id';
  });

  it('initialize Firebase with the correct configuration', async () => {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const { db } = await import('../firebaseConfig');

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: 'test-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-sender-id',
      appId: 'test-app-id',
      measurementId: 'test-measurement-id',
    });

    expect(getFirestore).toHaveBeenCalledWith('mocked-app');
    expect(db).toBe('mocked-db');
  });
});
