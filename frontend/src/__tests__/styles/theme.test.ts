// frontend/src/__tests__/styles/theme.test.ts
import theme from '../../styles/theme';

describe('theme.ts', () => {
  it('should set a valid MUI theme', () => {
    expect(theme).toBeDefined();
    expect(theme.palette.primary.main).toBe('#2E7D32');
    expect(theme.typography.h1.fontSize).toBe('2rem');
    expect(theme.shape.borderRadius).toBe(6);
  });
  it('should export a valid MUI theme', () => {
    expect(theme).toBeDefined();

    expect(theme.palette.primary.main).toBe('#2E7D32');

    expect(theme.typography.h1.fontSize).toBe('2rem');

    expect(theme.shape.borderRadius).toBe(6);

    const cssBaselineStyles = theme.components?.MuiCssBaseline?.styleOverrides;
    expect(typeof cssBaselineStyles).toBe('function');
    if (typeof cssBaselineStyles === 'function') {
      const styles = cssBaselineStyles(theme);
      if (styles && typeof styles === 'object' && 'backgroundColor' in styles) {
        expect(styles.backgroundColor).toBe(theme.palette.background.default);
      }
    } else {
      throw new Error('cssBaselineStyles is not a function');
    }
  });

  it('convert px to rem correctly', () => {
    expect(theme.typography.h1.fontSize).toBe('2rem');
    expect(theme.typography.button.fontSize).toBe('1rem');
  });
});
