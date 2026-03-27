import { screens } from "@/utils/screens.utils";

export const menus = (userId: string) => [
    {
        name: 'Profile',
        icon: 'person',
        href: screens.user.profile(userId),
    },
    {
        name: "Bookmarks",
        icon: 'bookmark',
        href: screens.bookmarks,
    },
    {
        name: 'Settings',
        icon: 'gearshape',
        href: screens.settings.index,
    },
]