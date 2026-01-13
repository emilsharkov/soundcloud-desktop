import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { ReactNode } from 'react';

interface SettingsContentProps {
    align?: 'start' | 'end' | 'center';
    children: ReactNode;
}

const SettingsContent = (props: SettingsContentProps) => {
    const { align = 'start', children } = props;
    return <DropdownMenuContent align={align}>{children}</DropdownMenuContent>;
};

export { SettingsContent };
