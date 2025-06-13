// frontend/src/component/vehicle/VehicleCard.tsx
import { Paper, Box, Stack, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ecoRideLogo from '../../assets/ecoride_logo.png';
import { getEnergyLabel, type Vehicle } from '../../types/vehicle';
import { ConfirmDialog } from '../dailog/ConfirmDialog';
import { useDialog } from '../../hooks/useDialog';

interface Props {
  vehicle?: Partial<Vehicle>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const VehicleCard: React.FC<Props> = ({ vehicle, onEdit, onDelete }) => {
  const { dialogOpen, setDialogOpen, handleDeleteClick, handleConfirmDelete } =
    useDialog();

  const onlyCard = !onEdit || !onDelete;
  const marginTopPaper = onlyCard ? 'unset' : 4;
  const widthPhoto = onlyCard ? '30%' : '22%';

  return (
    <Paper
      aria-label="vehicle-card"
      elevation={3}
      sx={(theme) => ({
        mt: marginTopPaper,
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
          width: widthPhoto,
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
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          textTransform: 'capitalize',
          width: { xs: '100%' },
        }}
      >
        <Stack spacing={1}>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ textTransform: 'uppercase' }}
          >
            {vehicle?.brand}
          </Typography>
          <Typography variant="body2">{vehicle?.model}</Typography>
          <Typography variant="body2">
            {getEnergyLabel(vehicle?.energy)}
          </Typography>
          <Typography variant="body2">{`${vehicle?.seatCount} places`}</Typography>
        </Stack>

        {!onlyCard && (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
              {vehicle?.licensePlate}
            </Typography>
            <Typography variant="body2">{`Année ${vehicle?.vehicleYear}`}</Typography>
            <Typography variant="body2">{vehicle?.color}</Typography>
          </Stack>
        )}
      </Box>
      {!onlyCard && (
        <Stack
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: 'center',
            justifyContent: { xs: 'space-around', md: 'space-between' },
            width: { xs: '100%', md: 'unset' },
          }}
        >
          <IconButton
            aria-label="edit"
            onClick={() => vehicle?.id && onEdit(vehicle?.id)}
            sx={(theme) => ({
              color: theme.palette.primary.main,
            })}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => vehicle?.id && handleDeleteClick(vehicle?.id)}
            sx={(theme) => ({
              color: theme.palette.error.main,
            })}
          >
            <DeleteForeverIcon />
          </IconButton>

          <ConfirmDialog
            open={dialogOpen}
            message={`Es-tu sûr de vouloir supprimer \
          ${vehicle?.brand?.toUpperCase()} \
          model ${vehicle?.model?.toUpperCase()} \
          dont la plaque d'immatriculation est ${vehicle?.licensePlate?.toUpperCase()} ?`}
            onCancel={() => setDialogOpen(false)}
            onConfirm={() => onDelete && handleConfirmDelete(onDelete)}
          />
        </Stack>
      )}
    </Paper>
  );
};
