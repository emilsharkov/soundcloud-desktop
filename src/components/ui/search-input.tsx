import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';

type SearchInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

const SearchInput = ({ className, ...props }: SearchInputProps) => {
    return (
        <Input
            type='search'
            className={cn(
                'outline-none border-none bg-search focus-visible:ring-0 rounded-sm placeholder:font-medium',
                className
            )}
            {...props}
        />
    );
};

export { SearchInput };
