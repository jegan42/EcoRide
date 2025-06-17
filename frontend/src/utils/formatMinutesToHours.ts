// frontend/src/utils/formatMinutesToHours.ts
export const formatMinutesToHours = (totalMinutes: number): string => {
  if (isNaN(totalMinutes) || totalMinutes < 0) return '';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
};
