import { Button } from '@/components/ui/button';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface SettingsTriggerProps {
    className?: string;
}

const SettingsTrigger = (props: SettingsTriggerProps) => {
    const { className } = props;
    return (
        <DropdownMenuTrigger asChild>
            <Button
                className={`hover:bg-transparent cursor-pointer ${className || ''}`}
                variant='ghost'
                size='icon'
            >
                <MoreVertical className='w-4 h-4 text-secondary' />
            </Button>
        </DropdownMenuTrigger>
    );
};

export { SettingsTrigger };
