// frontend/src/hooks/useReviewAuthor.ts
import { useEffect, useState } from 'react';
import type { User } from '../types/user';
import { fetchUserById } from '../services/userService';

export const useReviewAuthor = (
  authorId?: string
): {
  author: User | null;
  loading: boolean;
  error: Error | null;
} => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authorId) {
      setAuthor(null);
      return;
    }

    const fetchAuthor = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchUserById(authorId);
        setAuthor(data);
      } catch (err) {
        setError(err as Error);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchAuthor();
  }, [authorId]);

  return { author, loading, error };
};
