/**
 * IconSymbol – Android & web fallback.
 * Metro resolves @/components/ui/icon-symbol to this file on Android/web (no .ios.tsx).
 * SF Symbols are iOS-only, so we use @expo/vector-icons (MaterialIcons) with a name mapping.
 * expo-icons / @expo/vector-icons are the same icon set; this project uses expo-symbols on iOS and vector-icons elsewhere.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Tab icons
  'house.fill': 'home',
  'magnifyingglass': 'search',
  'person.2.fill': 'people',
  'bell.fill': 'notifications',
  'bell': 'notifications',
  // Drawer icons
  'person': 'person',
  'person.fill': 'person',
  'bookmark': 'bookmark',
  'bookmark.fill': 'bookmark',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  'rectangle.portrait.and.arrow.right': 'logout',
  // Navigation
  'chevron.left': 'arrow-back',
  'chevron.right': 'chevron-right',
  // School & major
  'building.2': 'account-balance',
  'book.closed': 'menu-book',
  // Media
  'photo.on.rectangle.angled': 'photo-library',
  'camera.fill': 'camera-alt',
  // Playback / controls
  'play.circle.fill': 'play-circle-filled',
  'xmark': 'close',
  // Actions
  'plus.circle.fill': 'add-circle',
  'pencil': 'edit',
  'trash': 'delete',
  'square.and.arrow.down': 'download',
  'square.and.arrow.up': 'ios-share',
  'doc.on.doc': 'content-copy',
  'flag': 'flag',
  // Social / status
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'message': 'mode-comment',
  'chart.bar': 'bar-chart',
  'ellipsis': 'more-horiz',
  'plus': 'add',
  // Dates
  'calendar': 'event',
  // Status
  'checkmark.circle.fill': 'check-circle',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
