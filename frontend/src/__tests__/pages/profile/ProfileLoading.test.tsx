// frontend/src/__tests__/pages/ProfilLoading.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileLoading from '../../../pages/profile/ProfileLoading';

describe('ProfileLoading', () => {
  it('affiche le skeleton circulaire pour l’avatar', () => {
    render(<ProfileLoading />);

    const avatar = screen.getByTestId('skeleton-avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('affiche le skeleton du nom d’utilisateur', () => {
    render(<ProfileLoading />);
    const headingSkeleton = screen.getByText((_, node) => {
      return node?.tagName === 'H5';
    });
    expect(headingSkeleton).toBeInTheDocument();
    const username = screen.getByTestId('skeleton-username');
    expect(username).toBeInTheDocument();
  });

  it('affiche 5 lignes de skeleton pour les infos utilisateur', () => {
    render(<ProfileLoading />);
    const lines = screen.getAllByTestId('skeleton-info');
    expect(lines).toHaveLength(5);
  });
});
