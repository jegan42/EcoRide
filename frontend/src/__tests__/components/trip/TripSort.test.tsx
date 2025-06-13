// frontend/src/__tests__/components/trip/TripSort.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TripSort } from '../../../components/trip/TripSort';
import { useState, type JSX } from 'react';

describe('TripSort', () => {
  it('renders sort select and toggles sort order correctly', async () => {
    const setSortKey = vi.fn();
    const setSortOrder = vi.fn();

    render(
      <TripSort
        sortKey=""
        sortOrder="asc"
        setSortKey={setSortKey}
        setSortOrder={setSortOrder}
      />
    );

    const user = userEvent.setup();

    const comboboxes = screen.getAllByRole('combobox');
    const sortSelect = comboboxes[0];
    expect(sortSelect).toBeInTheDocument();

    await user.click(sortSelect);
    const priceOption = await screen.findByRole('option', { name: /Prix/i });
    await user.click(priceOption);
    expect(setSortKey).toHaveBeenCalledWith('price');

    const sortButton = screen.getByRole('button');
    expect(sortButton).toBeInTheDocument();

    await user.click(sortButton);
    expect(setSortOrder).toHaveBeenCalled();
  });
});

const TripSortWrapper = (): JSX.Element => {
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return (
    <>
      <TripSort
        sortKey={sortKey}
        sortOrder={sortOrder}
        setSortKey={setSortKey}
        setSortOrder={setSortOrder}
      />
      <div data-testid="sort-order">{sortOrder}</div>
    </>
  );
};

describe('TripSort functional behavior', () => {
  it('toggles sortOrder from asc to desc and back', async () => {
    const user = userEvent.setup();
    render(<TripSortWrapper />);

    const sortButton = screen.getByRole('button');

    expect(screen.getByTestId('sort-order').textContent).toBe('asc');

    await user.click(sortButton);
    expect(screen.getByTestId('sort-order').textContent).toBe('desc');

    await user.click(sortButton);
    expect(screen.getByTestId('sort-order').textContent).toBe('asc');
  });
});
