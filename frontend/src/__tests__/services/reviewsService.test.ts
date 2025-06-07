// frontend/src/__tests__/services/reviewsService.test.tsx
import {
  addReview,
  getAllReviews,
  getReviewsByAuthor,
  getReviewsByTarget,
  updateReview,
  deleteReview,
} from '../../services/reviewsService';
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

describe('reviewsService', () => {
  const mockCollection = {};
  const mockDocRef = { id: 'mock-id' };
  const mockDoc = { id: '123', data: () => ({ rating: 5, comment: 'Top!' }) };
  const mockQuery = {};

  beforeEach(() => {
    (collection as jest.Mock).mockReturnValue(mockCollection);
    (where as jest.Mock).mockReturnValue('mock-where');
    (query as jest.Mock).mockReturnValue(mockQuery);
    vi.clearAllMocks();
  });

  it('addReview adds a review', async () => {
    (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

    const result = await addReview({
      author_id: 'a1',
      target_id: 't1',
      trip_id: 'tr1',
      rating: 4,
      comment: 'Super',
    });

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'reviews');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        author_id: 'a1',
        target_id: 't1',
        trip_id: 'tr1',
        rating: 4,
        comment: 'Super',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
    expect(result.message).toBe('Avis ajouté avec succès');
    expect(result.data).toBe(mockDocRef);
  });

  it('getAllReviews returns all reviews', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [mockDoc],
    });

    const result = await getAllReviews();
    expect(getDocs).toHaveBeenCalledWith(mockCollection);
    expect(result.message).toBe('Avis récupérés');
    expect(result.data).toEqual([{ id: '123', rating: 5, comment: 'Top!' }]);
  });

  it('getReviewsByAuthor filter by author_id', async () => {
    const mockQuery = {};
    (query as jest.Mock).mockReturnValue(mockQuery);
    (getDocs as jest.Mock).mockResolvedValue({ docs: [mockDoc] });

    const result = await getReviewsByAuthor('author-42');

    expect(where).toHaveBeenCalledWith('author_id', '==', 'author-42');
    expect(query).toHaveBeenCalledWith(mockCollection, expect.anything());
    expect(getDocs).toHaveBeenCalledWith(mockQuery);
    expect(result.message).toBe('Avis par autheur récupérés');
    expect(result.data).toEqual([{ id: '123', rating: 5, comment: 'Top!' }]);
  });

  it('getReviewsByTarget filter by target_id', async () => {
    const mockQuery = {};
    (query as jest.Mock).mockReturnValue(mockQuery);
    (getDocs as jest.Mock).mockResolvedValue({ docs: [mockDoc] });

    const result = await getReviewsByTarget('target-42');

    expect(where).toHaveBeenCalledWith('target_id', '==', 'target-42');
    expect(query).toHaveBeenCalledWith(mockCollection, expect.anything());
    expect(result.message).toBe('Avis par chauffeur récupérés');
    expect(result.data).toEqual([{ id: '123', rating: 5, comment: 'Top!' }]);
  });

  it('updateReview updates a review', async () => {
    const mockReviewDoc = {};
    (doc as jest.Mock).mockReturnValue(mockReviewDoc);

    const result = await updateReview('rev-id', { rating: 3 });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'reviews', 'rev-id');
    expect(updateDoc).toHaveBeenCalledWith(
      mockReviewDoc,
      expect.objectContaining({
        rating: 3,
        updated_at: expect.any(Date),
      })
    );
    expect(result.message).toBe('Avis mis à jour');
  });

  it('deleteReview deletes a review', async () => {
    const mockReviewDoc = {};
    (doc as jest.Mock).mockReturnValue(mockReviewDoc);

    const result = await deleteReview('rev-id');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'reviews', 'rev-id');
    expect(deleteDoc).toHaveBeenCalledWith(mockReviewDoc);
    expect(result.message).toBe('Avis supprimé');
  });
});
