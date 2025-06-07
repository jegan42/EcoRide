// frontend/src/__tests__/components/dashboard/DashboardSectionWrapper.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardSectionWrapper } from '../../../components/dashboard/DashboardSectionWrapper';

describe('DashboardSectionWrapper', () => {
  it('renders the title and children', () => {
    render(
      <DashboardSectionWrapper title="Ma section">
        <div>Contenu enfant</div>
      </DashboardSectionWrapper>
    );

    expect(screen.getByText('Ma section')).toBeInTheDocument();

    expect(screen.getByText('Contenu enfant')).toBeInTheDocument();
  });
});
