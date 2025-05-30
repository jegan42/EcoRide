// frontend/src/__tests__/services/contactsService.test.tsx
import {
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
} from '../../services/contactsService';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { vi } from 'vitest';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

describe('contactsService', () => {
  const mockCollection = { id: 'mock-collection' };
  const mockDocRef = { id: 'mock-doc-ref' };

  beforeEach(() => {
    (collection as jest.Mock).mockReturnValue(mockCollection);
    vi.clearAllMocks();
  });

  it('addContact ajoute un contact et renvoie le document', async () => {
    (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

    const result = await addContact({ email: 'test@example.com' });

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'contacts');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        email: 'test@example.com',
        sent_at: expect.any(Date),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
    expect(result).toBe(mockDocRef);
  });

  it('getAllContacts récupère tous les contacts', async () => {
    const fakeSnapshot = {
      docs: [
        {
          id: '1',
          data: () => ({
            email: 'user1@example.com',
            message: 'Hello',
          }),
        },
        {
          id: '2',
          data: () => ({
            email: 'user2@example.com',
            message: 'Hi there',
          }),
        },
      ],
    };
    (getDocs as jest.Mock).mockResolvedValue(fakeSnapshot);

    const result = await getAllContacts();

    expect(getDocs).toHaveBeenCalledWith(mockCollection);
    expect(result).toEqual([
      { id: '1', email: 'user1@example.com', message: 'Hello' },
      { id: '2', email: 'user2@example.com', message: 'Hi there' },
    ]);
  });

  it('updateContact met à jour le contact avec ID donné', async () => {
    const mockDoc = { id: '1' };
    (doc as jest.Mock).mockReturnValue(mockDoc);

    await updateContact('1', { email: 'updated@example.com' });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'contacts', '1');
    expect(updateDoc).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        email: 'updated@example.com',
        updated_at: expect.any(Date),
      })
    );
  });

  it('deleteContact supprime le contact avec ID donné', async () => {
    const mockDoc = { id: '1' };
    (doc as jest.Mock).mockReturnValue(mockDoc);

    await deleteContact('1');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'contacts', '1');
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
  });
});
