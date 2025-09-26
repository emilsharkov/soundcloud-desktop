import { Tab } from '@/models/tabs';
import { createContext, useContext } from 'react';

export type NavContextType = {
    selectedTab: Tab;
    setSelectedTab: (tab: Tab) => void;
    selectedSearch: string | undefined;
    setSelectedSearch: (search: string | undefined) => void;
};

export const NavContext = createContext<NavContextType>({
    selectedTab: 'search',
    setSelectedTab: () => {},
    selectedSearch: undefined,
    setSelectedSearch: () => {},
});

export const useNavContext = () => {
    return useContext(NavContext);
};
