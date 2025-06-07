// frontend/src/__tests__/services/historiesService.test.tsx
import {
  addHistory,
  getAllHistories,
  getHistoriesByUser,
  updateHistory,
  deleteHistory,
} from '../../services/historiesService';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { vi } from 'vitest';
import type { History } from '../../types/history';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

describe('historiesService', () => {
  const mockCollection = {};
  const mockDocRef = { id: 'mock-id' };
  const mockDoc = {
    id: 'h1',
    data: () => ({ trip_id: 'trip42', user_id: 'user1' }),
  };
  const mockQuery = {};

  beforeEach(() => {
    (collection as jest.Mock).mockReturnValue(mockCollection);
    (where as jest.Mock).mockReturnValue('mock-where');
    (query as jest.Mock).mockReturnValue(mockQuery);
    vi.clearAllMocks();
  });

  it('addHistory adds a history', async () => {
    (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

    const history = {
      trip_id: 'trip42',
      user_id: 'user1',
      role: 'passenger',
      status: 'completed',
    } as Partial<History>;

    const result = await addHistory(history);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'histories');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...history,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
    expect(result.message).toBe('Historique ajouté avec succès');
    expect(result.data).toBe(mockDocRef);
  });

  it('getAllHistories returns all histories', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [mockDoc] });

    const result = await getAllHistories();

    expect(getDocs).toHaveBeenCalledWith(mockCollection);
    expect(result.message).toBe('Historiques récupérés');
    expect(result.data).toEqual([
      { id: 'h1', trip_id: 'trip42', user_id: 'user1' },
    ]);
  });

  it('getHistoriesByUser filters histories by user_id', async () => {
    const mockQuery = {};
    (query as jest.Mock).mockReturnValue(mockQuery);
    (getDocs as jest.Mock).mockResolvedValue({ docs: [mockDoc] });

    const result = await getHistoriesByUser('user1');

    expect(where).toHaveBeenCalledWith('user_id', '==', 'user1');
    expect(query).toHaveBeenCalledWith(mockCollection, expect.anything());
    expect(getDocs).toHaveBeenCalledWith(mockQuery);
    expect(result.message).toBe('Historiques utilisateur récupérés');
    expect(result.data).toEqual([
      { id: 'h1', trip_id: 'trip42', user_id: 'user1' },
    ]);
  });

  it('updateHistory updates a history', async () => {
    const mockHistoryDoc = {};
    (doc as jest.Mock).mockReturnValue(mockHistoryDoc);

    const result = await updateHistory('history-id', { status: 'cancelled' });

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'histories',
      'history-id'
    );
    expect(updateDoc).toHaveBeenCalledWith(
      mockHistoryDoc,
      expect.objectContaining({
        status: 'cancelled',
        updated_at: expect.any(Date),
      })
    );
    expect(result.message).toBe('Historique mis à jour');
  });

  it('deleteHistory deletes a history', async () => {
    const mockHistoryDoc = {};
    (doc as jest.Mock).mockReturnValue(mockHistoryDoc);

    const result = await deleteHistory('history-id');

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'histories',
      'history-id'
    );
    expect(deleteDoc).toHaveBeenCalledWith(mockHistoryDoc);
    expect(result.message).toBe('Historique supprimé');
  });
});
