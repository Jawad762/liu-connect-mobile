import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

function findDrawerNavigator(navigation: NavigationProp<ParamListBase>) {
    let nav: NavigationProp<ParamListBase> | undefined = navigation;
    while (nav) {
        if (nav.getState()?.type === 'drawer') return nav;
        nav = nav.getParent();
    }
    return undefined;
}

/**
 * Disables the drawer swipe gesture while the screen is mounted,
 * so that a horizontal swipe triggers the stack back-gesture instead.
 * Works regardless of how deeply nested the screen is inside the drawer.
 */
export function useDisableDrawerSwipe() {
    const navigation = useNavigation();

    useEffect(() => {
        const drawerNavigation = findDrawerNavigator(navigation as any);
        drawerNavigation?.setOptions({ swipeEnabled: false });

        return () => {
            drawerNavigation?.setOptions({ swipeEnabled: true });
        };
    }, [navigation]);
}
