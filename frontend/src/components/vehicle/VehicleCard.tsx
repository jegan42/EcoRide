// frontend/src/component/vehicle/VehicleCard.tsx
import { Paper, Box, Stack, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ecoRideLogo from '../../assets/ecoride_logo.png';
import { getEnergyLabel, type Vehicle } from '../../types/vehicle';

interface Props {
  vehicle?: Partial<Vehicle>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VehicleCard: React.FC<Props> = ({ vehicle, onEdit, onDelete }) => {
  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        mt: 4,
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        borderRadius: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        flexWrap: 'wrap',
        gap: 2,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22%',
        }}
      >
        <Box
          component="img"
          src={vehicle?.photo ?? ecoRideLogo}
          alt="Photo du véhicule"
          sx={{
            maxWidth: '100%',
            maxHeight: 100,
            objectFit: 'contain',
            borderRadius: 2,
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Stack>
          <Typography variant="body2" fontWeight={700}>
            {vehicle?.brand}
          </Typography>
          <Typography variant="body2">{vehicle?.model}</Typography>
          <Typography variant="body2">{vehicle?.licensePlate}</Typography>
          <Typography variant="body2">{`Année ${vehicle?.vehicleYear}`}</Typography>
        </Stack>

        <Stack>
          <Typography variant="body2">{vehicle?.color}</Typography>
          <Typography variant="body2">
            {getEnergyLabel(vehicle?.energy)}
          </Typography>
          <Typography variant="body2">{`${vehicle?.seatCount} places`}</Typography>
        </Stack>

        <Stack>
          <IconButton
            aria-label="edit"
            onClick={() => vehicle?.id && onEdit(vehicle?.id)}
            sx={(theme) => ({ ml: 'auto', color: theme.palette.primary.main })}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => vehicle?.id && onDelete(vehicle?.id)}
            sx={(theme) => ({ ml: 'auto', color: theme.palette.error.main })}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
};
