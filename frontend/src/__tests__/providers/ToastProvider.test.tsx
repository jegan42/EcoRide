// frontend/src/__tests__/providers/ToastProvider.test.tsx
import { render, screen } from '@testing-library/react';
import ToastProvider from '../../providers/ToastProvider';

describe('ToastProvider', () => {
  it('render les enfants dans SnackbarProvider', () => {
    render(
      <ToastProvider>
        <div>Contenu test</div>
      </ToastProvider>
    );

    expect(screen.getByText('Contenu test')).toBeInTheDocument();
  });
});
