import { Colors } from '@/constants/theme';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '../reusable/icon-symbol';
import { ThemedText } from '../reusable/themed-text';

interface ImageViewerModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
}

export function ImageViewerModal({ visible, imageUri, onClose }: ImageViewerModalProps) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { colorScheme = 'light' } = useColorScheme();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!imageUri) return;
        setSaving(true);
        try {
            const { status } = await MediaLibrary.getPermissionsAsync();
            let canSave = status === 'granted';
            if (!canSave) {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                canSave = newStatus === 'granted';
            }
            if (!canSave) {
                Alert.alert(
                    'Permission needed',
                    'Allow access to save photos to your library.',
                    [{ text: 'OK' }]
                );
                return;
            }
            const isRemote = imageUri.startsWith('http');
            const localUri = isRemote
                ? `${FileSystem.cacheDirectory}saved_${Date.now()}.jpg`
                : imageUri;
            if (isRemote) {
                await FileSystem.downloadAsync(imageUri, localUri);
            }
            await MediaLibrary.saveToLibraryAsync(localUri);
            Alert.alert('Saved', 'Image saved to your photos.');
        } catch (e) {
            Alert.alert('Could not save', e instanceof Error ? e.message : 'Failed to save image.');
        } finally {
            setSaving(false);
        }
    };

    const imageHeight = height - insets.top - insets.bottom;

    if (!imageUri) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View
                className="flex-1 justify-center bg-black/95"
                style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            >
                <Pressable className="absolute inset-0" onPress={onClose} />
                {imageUri && (
                    <View className="absolute inset-0 justify-center items-center" pointerEvents="box-none">
                        <ImageZoom
                            uri={imageUri}
                            style={{ width, height: imageHeight }}
                            minScale={1}
                            maxScale={4}
                            doubleTapScale={2}
                            isSingleTapEnabled={false}
                            resizeMode="contain"
                        />
                    </View>
                )}
                <View
                    className="absolute left-4 right-4 flex-row justify-between"
                    style={{ top: insets.top + 8 }}
                    pointerEvents="box-none"
                >
                    <Pressable
                        onPress={onClose}
                        hitSlop={12}
                        className="w-10 h-10 rounded-full justify-center items-center bg-black/50"
                    >
                        <IconSymbol name="xmark" size={22} color="white" />
                    </Pressable>
                </View>
                <View
                    className="absolute left-4 right-4 items-center"
                    style={{ bottom: insets.bottom + 16 }}
                    pointerEvents="box-none"
                >
                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        className="flex-row items-center py-3 px-6 rounded-3xl"
                        style={{ backgroundColor: Colors[colorScheme].accent }}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <IconSymbol name="square.and.arrow.down" size={20} color="white" />
                                <ThemedText className="text-white font-sans ml-2">Save to photos</ThemedText>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
