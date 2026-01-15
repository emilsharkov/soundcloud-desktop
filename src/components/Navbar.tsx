import { useSearchResults } from '@/hooks/useSearchResults';
import { useNav } from '@/providers/NavProvider';
import { SearchResult } from '@/types/schemas';
import { TABS } from '@/types/tabs';
import { upperFirst } from 'lodash';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import Soundcloud from '../assets/soundcloud.svg?react';
import { Input } from './ui/input';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from './ui/navigation-menu';
import { Popover, PopoverAnchor, PopoverContent } from './ui/popover';

const Navbar = () => {
    const { selectedTab, setSelectedSearch, setSelectedTab } = useNav();
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch] = useDebounceValue(search, 500);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const { data: searchResults } = useSearchResults(debouncedSearch);

    const selectSearchResult = (searchResult: SearchResult) => {
        const { output } = searchResult;
        setSelectedSearch(output ?? undefined);
        setSearch(output ?? '');
        setPopoverOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            selectSearchResult({ output: search, query: null });
            e.currentTarget.blur();
            setSelectedTab('search');
        }
    };

    return (
        <NavigationMenu className='w-full max-w-none max-h-fit'>
            <Soundcloud className='w-14 h-14 mx-6' />
            <NavigationMenuList className='text-tertiary font-semibold text-sm gap-4'>
                {TABS.map(tab => (
                    <NavigationMenuItem
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className='cursor-pointer'
                        style={{
                            color:
                                selectedTab === tab
                                    ? 'var(--color-secondary)'
                                    : 'var(--color-tertiary)',
                        }}
                    >
                        {upperFirst(tab)}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
            <Popover open={searchResults !== undefined && popoverOpen}>
                <PopoverAnchor>
                    <div className='relative w-full mx-4'>
                        <Input
                            className='border-none bg-search focus-visible:ring-0 rounded-sm placeholder:font-medium'
                            placeholder='Search'
                            value={search}
                            onKeyDown={onKeyDown}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setPopoverOpen(true)}
                            onBlur={() => setPopoverOpen(false)}
                        />
                        <Search className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary pointer-events-none' />
                    </div>
                </PopoverAnchor>
                {searchResults !== undefined ? (
                    <PopoverContent
                        onOpenAutoFocus={e => e.preventDefault()}
                        onCloseAutoFocus={e => e.preventDefault()}
                    >
                        <div className='w-full bg-white rounded-lg flex flex-col'>
                            {searchResults.collection.length === 0 ? (
                                <div className='text-black text-center'>
                                    No results found
                                </div>
                            ) : (
                                searchResults.collection.map(
                                    (
                                        searchResult: SearchResult,
                                        idx: number
                                    ) => {
                                        const { output } = searchResult;
                                        return (
                                            <div
                                                key={idx}
                                                className='px-3 py-1 text-black'
                                                onClick={() =>
                                                    selectSearchResult(
                                                        searchResult
                                                    )
                                                }
                                            >
                                                {output}
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </PopoverContent>
                ) : null}
            </Popover>
        </NavigationMenu>
    );
};

export { Navbar };
