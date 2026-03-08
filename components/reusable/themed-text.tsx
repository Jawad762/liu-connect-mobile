import { Text, type TextProps } from 'react-native';
import { cn } from '@/utils/cn.utils';

export function ThemedText({
  className,
  ...rest
}: TextProps) {
  return (
    <Text
      className={cn(
        "text-foreground dark:text-foregroundDark font-sans",
        className
      )}
      {...rest}
    />
  );
}
