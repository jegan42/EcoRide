// tests/__tests__/hooks/usePreferences.test.tsx
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true for a mobile screen', () => {
    window.matchMedia = createMatchMedia(true);
    const { result } = renderHook(() => useIsMobile(), {
      wrapper: ({ children }) => (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      ),
    });

    expect(result.current).toBe(true);
  });

  it('should return false for a desktop screen', () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsMobile(), {
      wrapper: ({ children }) => (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      ),
    });

    expect(result.current).toBe(false);
  });
});
