// tests/__tests__/hooks/currentUserIsDriver.test
import * as roleUtils from '../../utils/hasRole';
import { vi } from 'vitest';
import { useIsDriver } from '../../hooks/useIsDriver';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { RoleEnum } from '../../types/user';

vi.mock('../../hooks/useAppSelector');
vi.mock('../../utils/hasRole');

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: ['driver'] as RoleEnum[],
};

describe('useIsDriver()', () => {
  const selectorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(selectorMock);
    selectorMock.mockReturnValue({ user: mockUser });
  });

  it('returns false when user is not defined', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: null });

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false when user is undefined', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: undefined });

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false when user is empty', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: {} });

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false when useAppSelector returns empty object', () => {
    (useAppSelector as jest.Mock).mockReturnValue({});

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('does not call hasRole when user is falsy', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: null });
    const hasRoleSpy = vi.spyOn(roleUtils, 'hasRole');

    const result = useIsDriver();
    expect(result).toBe(false);
    expect(hasRoleSpy).not.toHaveBeenCalled();
  });

  it('returns true when user is a driver', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: ['driver'] },
    });
    vi.spyOn(roleUtils, 'hasRole').mockReturnValue(true);

    const result = useIsDriver();
    expect(roleUtils.hasRole).toHaveBeenCalledWith(mockUser, 'driver');
    expect(result).toBe(true);
  });

  it('returns false when user is not a driver', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: ['passenger'] },
    });
    vi.spyOn(roleUtils, 'hasRole').mockReturnValue(false);

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false when user is not a driver', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: ['passenger'] },
    });
    vi.spyOn(roleUtils, 'hasRole').mockReturnValue(false);

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false if user is present but not a driver (hasRole returns false)', () => {
    const fakeUser = { ...mockUser, role: ['passenger'] };
    (useAppSelector as jest.Mock).mockReturnValue({ user: fakeUser });
    const hasRoleSpy = vi.spyOn(roleUtils, 'hasRole').mockReturnValue(false);

    const result = useIsDriver();

    expect(hasRoleSpy).toHaveBeenCalledWith(fakeUser, 'driver');
    expect(result).toBe(false);
  });

  it('returns false when user is falsy boolean', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: false });

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('returns false when useAppSelector returns null', () => {
    (useAppSelector as jest.Mock).mockReturnValue(null);

    const result = useIsDriver();
    expect(result).toBe(false);
  });

  it('calls hasRole and returns false if user exists but is not a driver', () => {
    const user = { ...mockUser, role: ['passenger'] };
    (useAppSelector as jest.Mock).mockReturnValue({ user });
    const hasRoleSpy = vi.spyOn(roleUtils, 'hasRole').mockReturnValue(false);

    const result = useIsDriver();

    expect(hasRoleSpy).toHaveBeenCalledWith(user, 'driver');
    expect(result).toBe(false);
  });

  it('calls hasRole and returns true if user is a driver', () => {
    const user = { ...mockUser, role: ['driver'] };
    (useAppSelector as jest.Mock).mockReturnValue({ user });
    const hasRoleSpy = vi.spyOn(roleUtils, 'hasRole').mockReturnValue(true);

    const result = useIsDriver();

    expect(hasRoleSpy).toHaveBeenCalledWith(user, 'driver');
    expect(result).toBe(true);
  });
});
