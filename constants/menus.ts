import { screens } from "@/utils/screens";

export const menus = (userId: string) => [
    {
        name: 'Profile',
        icon: 'person',
        href: screens.user.details(userId),
    },
    {
        name: "Bookmarks",
        icon: 'bookmark',
        href: screens.bookmarks,
    },
    {
        name: 'Settings',
        icon: 'gearshape',
        href: '/settings',
    },
]