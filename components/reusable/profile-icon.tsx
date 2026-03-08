import { cn } from '@/utils/cn.utils'
import React from 'react'
import { Image } from 'react-native'

const ProfileIcon = ({ avatarUrl, className }: { avatarUrl: string | null, className?: string }) => {
    if (avatarUrl) {
        return <Image source={{ uri: avatarUrl }} className={cn("w-10 h-10 rounded-full", className)} />
    }
    return <Image source={require("@/assets/images/default-avatar.png")} className={cn("w-10 h-10 rounded-full", className)} />
}

export default ProfileIcon