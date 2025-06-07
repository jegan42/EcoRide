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

  it('addContact adds a contact and returns the document', async () => {
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
    expect(result.message).toBe('Contact ajouté avec succès');
    expect(result.data).toBe(mockDocRef);
  });

  it('getAllContacts retrieves all contacts', async () => {
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
    expect(result.message).toBe('Contacts récupérés');
    expect(result.data).toEqual([
      { id: '1', email: 'user1@example.com', message: 'Hello' },
      { id: '2', email: 'user2@example.com', message: 'Hi there' },
    ]);
  });

  it('updateContact updates the contact with the given ID', async () => {
    const mockDoc = { id: '1' };
    (doc as jest.Mock).mockReturnValue(mockDoc);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    const response = await updateContact('1', { email: 'updated@example.com' });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'contacts', '1');
    expect(updateDoc).toHaveBeenCalledWith(
      mockDoc,
      expect.objectContaining({
        email: 'updated@example.com',
        updated_at: expect.any(Date),
      })
    );

    expect(response).toEqual({
      message: 'Contact mis à jour',
      data: undefined,
    });
  });

  it('deleteContact deletes the contact with the given ID', async () => {
    const mockDoc = { id: '1' };
    (doc as jest.Mock).mockReturnValue(mockDoc);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    const response = await deleteContact('1');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'contacts', '1');
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
    expect(response).toEqual({
      message: 'Contact supprimé',
      data: undefined,
    });
  });
});
