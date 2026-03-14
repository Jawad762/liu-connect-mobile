import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { PlayingChangeEventPayload } from 'expo-video';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { MediaType } from '@/types/media.types';

interface MediaItemProps {
    uri: string;
    type: MediaType;
    style?: ViewStyle;
    onRemove?: () => void;
    onImagePress?: () => void;
}

function InlineVideo({ uri }: { uri: string }) {
    const { colorScheme = 'light' } = useColorScheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const player = useVideoPlayer(uri, () => {});

    useEffect(() => {
        setIsPlaying(player.playing);
        const sub = player.addListener('playingChange', (e: PlayingChangeEventPayload) => {
            setIsPlaying(e.isPlaying);
        });
        return () => sub.remove();
    }, [player]);

    return (
        <View style={{ width: '100%', aspectRatio: 1, position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            <VideoView
                player={player}
                contentFit="cover"
                nativeControls
                style={{
                    width: '100%',
                    aspectRatio: 1,
                    borderRadius: 12,
                    backgroundColor: Colors[colorScheme].surface ?? '#1a1a1a',
                    overflow: 'hidden',
                }}
            />
            {!isPlaying && (
                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: 999,
                            padding: 12,
                        }}
                    >
                        <IconSymbol name="play.circle.fill" size={48} color="white" />
                    </View>
                </View>
            )}
        </View>
    );
}

const MediaItem = ({ uri, type, style, onRemove, onImagePress }: MediaItemProps) => {
    const { colorScheme = 'light' } = useColorScheme();

    return (
        <View style={[style, { position: 'relative' }]}>
            {type === 'VIDEO' ? (
                <InlineVideo uri={uri} />
            ) : (
                <Pressable onPress={onImagePress} style={{ width: '100%' }}>
                    <Image
                        source={{ uri }}
                        contentFit="cover"
                        transition={250}
                        style={{
                            width: '100%',
                            aspectRatio: 1,
                            borderRadius: 12,
                            backgroundColor: Colors[colorScheme].surface,
                        }}
                    />
                </Pressable>
            )}
            {onRemove && (
                <Pressable
                    onPress={onRemove}
                    hitSlop={8}
                    style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        borderRadius: 999,
                        padding: 4,
                    }}
                >
                    <IconSymbol name="xmark" size={12} color="white" />
                </Pressable>
            )}
        </View>
    );
};

export default MediaItem;
