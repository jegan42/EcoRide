// frontend/src/components/switchbutton/SwitchButton.tsx
import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  switchOn?: string;
  switchOff?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom' | undefined;
}

export const SwitchButton: React.FC<Props> = ({
  checked,
  onChange,
  switchOn = 'Activé',
  switchOff = 'Désactivé',
  labelPlacement = 'end',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label={checked ? switchOn : switchOff}
      labelPlacement={labelPlacement}
    />
  );
};
