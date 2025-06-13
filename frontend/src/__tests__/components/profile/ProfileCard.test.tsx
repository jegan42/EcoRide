// frontend/src/__tests__/components/profile/ProfileCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileCard } from '../../../components/profile/ProfileCard';

describe('ProfileCard', () => {
  it('renders user information correctly', () => {
    const mockUser = {
      username: 'JohnDoe',
      email: 'john@example.com',
      phone: '1234567890',
      avatar: 'https://example.com/avatar.jpg',
    };

    render(<ProfileCard user={mockUser} />);

    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', mockUser.avatar);
  });

  it('handles missing user gracefully', () => {
    render(<ProfileCard />);

    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('renders partial user info', () => {
    const partialUser = { username: 'OnlyName' };
    render(<ProfileCard user={partialUser} />);

    expect(screen.getByText('OnlyName')).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
});
