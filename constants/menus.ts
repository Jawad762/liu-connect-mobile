import type { ComponentProps } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { screens } from "@/utils/screens.utils"

export type MenuIconName = ComponentProps<typeof MaterialCommunityIcons>['name']

export const menus = (userId: string) => [
    {
        name: 'Profile',
        icon: 'account' as const satisfies MenuIconName,
        href: screens.user.profile(userId),
    },
    {
        name: "Bookmarks",
        icon: 'bookmark-outline' as const satisfies MenuIconName,
        href: screens.bookmarks,
    },
    {
        name: 'Settings',
        icon: 'cog' as const satisfies MenuIconName,
        href: screens.settings.index,
    },
]