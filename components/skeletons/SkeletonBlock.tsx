import React from 'react'
import { useColorScheme } from 'nativewind'
import { View } from 'react-native'

type SkeletonBlockProps = {
    width?: number | string
    height?: number
    borderRadius?: number
}

const SkeletonBlock = ({
    width,
    height = 16,
    borderRadius = 4,
}: SkeletonBlockProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const bgColor = colorScheme === 'dark' ? 'rgba(113, 118, 123, 0.4)' : 'rgba(83, 100, 113, 0.35)'

    return (
        <View
            style={{ width: width as number, height: height, borderRadius: borderRadius, backgroundColor: bgColor }}
        />
    )
}

export default SkeletonBlock

