// frontend/src/component/findtrip/FindTripInfoVehicle.tsx
import { Box, Stack } from '@mui/material';
import { getEnergyLabel, type Vehicle } from '../../types/vehicle';
import { formatField } from '../../utils/formatField';
import ecoRideLogo from '../../assets/ecoride_logo.png';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { getFuelEcoGroup } from '../../utils/getFuelEcoGroup';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { TripInfoRow } from './TripInfoRow';
import { type JSX } from 'react';
import BadgeIcon from '@mui/icons-material/Badge';
import PaletteIcon from '@mui/icons-material/Palette';

interface Props {
  vehicle?: Vehicle;
  allInfo?: boolean;
}

export const FindTripInfoVehicle: React.FC<Props> = ({
  vehicle,
  allInfo = false,
}) => {
  const stackDirection = allInfo ? 'row-reverse' : 'column';
  const stackWidth = allInfo ? '50%' : '100%';
  const fuelEcoGroup = getFuelEcoGroup(vehicle?.energy);

  const getEcoIcon = (): JSX.Element => {
    switch (fuelEcoGroup) {
      case 'notEco':
        return (
          <LocalGasStationIcon fontSize="small" sx={{ color: 'error.main' }} />
        );
      case 'mediumEco':
        return (
          <AutorenewIcon fontSize="small" sx={{ color: 'warning.main' }} />
        );
      case 'eco':
        return (
          <EnergySavingsLeafIcon
            fontSize="small"
            sx={{ color: 'primary.main' }}
          />
        );
      case 'unknown':
      default:
        return (
          <BatteryChargingFullIcon
            fontSize="small"
            sx={{ color: 'primary.dark' }}
          />
        );
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: stackDirection },
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {allInfo && (
        <Box
          component="img"
          src={vehicle?.photo ?? ecoRideLogo}
          alt="Photo du véhicule"
          sx={{
            maxWidth: '100%',
            maxHeight: 150,
            objectFit: 'contain',
            borderRadius: 2,
          }}
        />
      )}

      <Stack
        direction={'column'}
        spacing={2}
        sx={{ width: { xs: '80%', sm: stackWidth } }}
      >
        <TripInfoRow
          icon={
            <DirectionsCarIcon
              sx={(theme) => ({ color: theme.palette.primary.dark })}
            />
          }
          label={formatField(vehicle?.brand)}
          value={formatField(vehicle?.model)}
        />

        <TripInfoRow
          icon={getEcoIcon()}
          label="Énergie :"
          value={formatField(getEnergyLabel(vehicle?.energy))}
        />
        {allInfo && (
          <>
            <TripInfoRow
              icon={
                <PaletteIcon
                  sx={(theme) => ({ color: theme.palette.primary.dark })}
                />
              }
              label="Couleur :"
              value={formatField(vehicle?.color)}
            />
            <TripInfoRow
              icon={
                <BadgeIcon
                  sx={(theme) => ({ color: theme.palette.primary.dark })}
                />
              }
              label="Immatriculation :"
              value={formatField(vehicle?.licensePlate)}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};
