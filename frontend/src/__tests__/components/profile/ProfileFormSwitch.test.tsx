// frontend/src/__tests__/profile/ProfileFormSwitch.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ProfileFormSwitch } from '../../../components/profile/ProfileFormSwitch';

vi.mock('../../../hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

vi.mock('../../../components/profile/ProfileForm', () => ({
  ProfileForm: ({
    onSubmit,
    onCancel,
    isSubmitting,
  }: {
    onSubmit: (data: { firstName: string }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
  }) => (
    <>
      <button onClick={() => onSubmit({ firstName: 'Test' })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
      <div>ProfileForm Mock - isSubmitting: {isSubmitting.toString()}</div>
    </>
  ),
}));

import { useProfile } from '../../../hooks/useProfile';

describe('ProfileFormSwitch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders ProfileForm when profileMode is "edit"', () => {
    vi.mocked(useProfile).mockReturnValue({
      user: { id: '1' },
      isDriver: false,
      isSubmitting: false,
      onUpdateUser: vi.fn(),
    });

    render(
      <ProfileFormSwitch
        isSubmitting={false}
        profileMode="edit"
        onSetProfileMode={vi.fn()}
      />
    );

    expect(screen.getByText(/ProfileForm Mock/i)).toBeInTheDocument();
  });

  it('renders nothing when profileMode is not "edit"', () => {
    vi.mocked(useProfile).mockReturnValue({
      user: { id: '1' },
      isDriver: false,
      isSubmitting: false,
      onUpdateUser: vi.fn(),
    });

    const { container } = render(
      <ProfileFormSwitch
        isSubmitting={false}
        profileMode="view"
        onSetProfileMode={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onUpdateUser and changes mode to "view" on successful submit', async () => {
    const onUpdateUser = vi.fn().mockResolvedValue(true);
    const onSetProfileMode = vi.fn();

    vi.mocked(useProfile).mockReturnValue({
      user: { id: '1' },
      isDriver: false,
      isSubmitting: false,
      onUpdateUser,
    });

    render(
      <ProfileFormSwitch
        isSubmitting={false}
        profileMode="edit"
        onSetProfileMode={onSetProfileMode}
      />
    );

    await userEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onUpdateUser).toHaveBeenCalledWith({ firstName: 'Test' });
      expect(onSetProfileMode).toHaveBeenCalledWith('view');
    });
  });

  it('does not change mode if onUpdateUser returns false', async () => {
    const onUpdateUser = vi.fn().mockResolvedValue(false);
    const onSetProfileMode = vi.fn();

    vi.mocked(useProfile).mockReturnValue({
      user: { id: '1' },
      isDriver: false,
      isSubmitting: false,
      onUpdateUser,
    });

    render(
      <ProfileFormSwitch
        isSubmitting={false}
        profileMode="edit"
        onSetProfileMode={onSetProfileMode}
      />
    );

    await userEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onUpdateUser).toHaveBeenCalledWith({ firstName: 'Test' });
      expect(onSetProfileMode).not.toHaveBeenCalled();
    });
  });

  it('calls onSetProfileMode("view") on cancel', async () => {
    vi.mocked(useProfile).mockReturnValue({
      user: { id: '1' },
      isDriver: false,
      isSubmitting: false,
      onUpdateUser: vi.fn(),
    });

    const onSetProfileMode = vi.fn();

    render(
      <ProfileFormSwitch
        isSubmitting={false}
        profileMode="edit"
        onSetProfileMode={onSetProfileMode}
      />
    );

    await userEvent.click(screen.getByText('Cancel'));

    expect(onSetProfileMode).toHaveBeenCalledWith('view');
  });
});
