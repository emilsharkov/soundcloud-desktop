import { Tab } from '@/types/tabs';
import { createContext, useContext, useState } from 'react';

export type NavContextType = {
    selectedTab: Tab;
    setSelectedTab: (tab: Tab) => void;
    selectedSearch: string | undefined;
    setSelectedSearch: (search: string | undefined) => void;
};

const NavContext = createContext<NavContextType>({
    selectedTab: 'search',
    setSelectedTab: () => {},
    selectedSearch: undefined,
    setSelectedSearch: () => {},
});

export const useNav = () => {
    return useContext(NavContext);
};

export interface NavProviderProps {
    children: React.ReactNode;
}

export const NavProvider = (props: NavProviderProps) => {
    const { children } = props;
    const [selectedTab, setSelectedTab] = useState<Tab>('search');
    const [selectedSearch, setSelectedSearch] = useState<string | undefined>(
        undefined
    );

    const contextValue: NavContextType = {
        selectedTab,
        setSelectedTab,
        selectedSearch,
        setSelectedSearch,
    };

    return (
        <NavContext.Provider value={contextValue}>
            {children}
        </NavContext.Provider>
    );
};
