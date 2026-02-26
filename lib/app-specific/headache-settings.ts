import colors from 'tailwindcss/colors';

type SeverityColorParams = {
  severity: number;
  colorScheme?: 'light' | 'dark';
};

export const getSeverityColor = ({
  severity,
  colorScheme = 'light',
}: SeverityColorParams): string => {
  if (colorScheme === 'dark') {
    if (severity >= 7) return colors.red[400];
    if (severity >= 4) return colors.yellow[400];
    return colors.green[400];
  }
  if (severity >= 7) return colors.red[500];
  if (severity >= 4) return colors.yellow[500];
  return colors.green[500];
};

export const getSeverityBgColor = ({
  severity,
  colorScheme = 'light',
}: SeverityColorParams): string => {
  if (colorScheme === 'dark') {
    if (severity >= 7) return colors.red[950];
    if (severity >= 4) return colors.yellow[950];
    return colors.green[950];
  }
  if (severity >= 7) return colors.red[100];
  if (severity >= 4) return colors.yellow[100];
  return colors.green[100];
};

export const getSeverityLabel = ({
  severity,
}: {
  severity: number;
}): 'mild' | 'moderate' | 'severe' => {
  if (severity >= 7) return 'severe';
  if (severity >= 4) return 'moderate';
  return 'mild';
};

export const formatDuration = ({ minutes }: { minutes: number }): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};
