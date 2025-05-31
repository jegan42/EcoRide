// frontend/src/__tests__/main.test.tsx
import { vi } from 'vitest';

const renderMock = vi.fn();

vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom/client')>();

  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: renderMock,
    })),
    default: actual,
  };
});

it('doit monter le composant App', async () => {
  const rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);

  await import('../main');
});
