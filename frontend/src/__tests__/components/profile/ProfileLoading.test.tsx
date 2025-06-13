// frontend/src/__tests__/components/profile/ProfileLoading.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileLoading } from '../../../components/profile/ProfileLoading';

describe('ProfileLoading', () => {
  it('renders skeleton avatar, username and info lines', () => {
    render(<ProfileLoading />);

    // Avatar skeleton
    expect(screen.getByTestId('skeleton-avatar')).toBeInTheDocument();

    // Username skeleton
    expect(screen.getByTestId('skeleton-username')).toBeInTheDocument();

    // Info skeletons (5 expected)
    const infoSkeletons = screen.getAllByTestId('skeleton-info');
    expect(infoSkeletons).toHaveLength(5);
  });
});
