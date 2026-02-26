export type RecordItemProps = {
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  imageUri?: string;
  date: Date;
  onDelete: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
};
