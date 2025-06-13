// frontend/src/__tests__/components/vehicle/VehicleSort.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { VehicleSort } from '../../../components/vehicle/VehicleSort';
import { useState, type JSX } from 'react';

describe('VehicleSort', () => {
  it('renders sort select and toggles sort order correctly', async () => {
    const setSortKey = vi.fn();
    const setSortOrder = vi.fn();

    render(
      <VehicleSort
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
    const yearOption = await screen.findByRole('option', { name: /Année/i });
    await user.click(yearOption);
    expect(setSortKey).toHaveBeenCalledWith('year');

    const sortButton = screen.getByRole('button');
    expect(sortButton).toBeInTheDocument();

    await user.click(sortButton);
    expect(setSortOrder).toHaveBeenCalled();
  });
});

const VehicleSortWrapper = (): JSX.Element => {
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return (
    <>
      <VehicleSort
        sortKey={sortKey}
        sortOrder={sortOrder}
        setSortKey={setSortKey}
        setSortOrder={setSortOrder}
      />
      <div data-testid="sort-order">{sortOrder}</div>
    </>
  );
};

describe('VehicleSort functional behavior', () => {
  it('toggles sortOrder from asc to desc and back', async () => {
    const user = userEvent.setup();
    render(<VehicleSortWrapper />);

    const sortButton = screen.getByRole('button');

    expect(screen.getByTestId('sort-order').textContent).toBe('asc');

    await user.click(sortButton);
    expect(screen.getByTestId('sort-order').textContent).toBe('desc');

    await user.click(sortButton);
    expect(screen.getByTestId('sort-order').textContent).toBe('asc');
  });
});
