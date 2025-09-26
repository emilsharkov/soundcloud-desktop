import { Tab } from '@/models/tabs';
import { useState } from 'react';
import { NavContext, NavContextType } from './NavContext';

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
