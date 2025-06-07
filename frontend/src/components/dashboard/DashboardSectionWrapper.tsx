// frontend/src/component/dashboard/DashboardSectionWrapper.tsx
import { Typography } from '@mui/material';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography
    variant="h6"
    fontWeight="bold"
    sx={(theme) => ({
      width: '100%',
      textAlign: 'center',
      borderTop: `1px solid ${theme.palette.text.primary}`,
      borderBottom: `1px solid ${theme.palette.text.primary}`,
    })}
    gutterBottom
  >
    {children}
  </Typography>
);

export const DashboardSectionWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </>
);
