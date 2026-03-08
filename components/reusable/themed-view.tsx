import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn.utils';

export function ThemedView({ className, ...otherProps }: ViewProps) {

  return (
    <View
      className={cn(
        "bg-background dark:bg-backgroundDark",
        className
      )}
      {...otherProps}
    />
  );
}
