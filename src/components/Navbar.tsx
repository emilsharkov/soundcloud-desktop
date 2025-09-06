import { useTauriInvoke } from "@/hooks/useTauriInvoke";
import { PagingCollection, SearchResult } from "@/models/response";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import Soundcloud from "../assets/soundcloud.svg?react";
import { Input } from "./ui/input";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";

interface SearchArgs {
    q: string;
}

export interface NavbarProps {
    setSelectedOutput: (output: string | undefined) => void;
}

const Navbar = (props: NavbarProps) => {
    const { setSelectedOutput } = props;
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const { data: searchResults } = useTauriInvoke<SearchArgs,PagingCollection<SearchResult>>(
        "search_results", { 
            q: debouncedSearch 
        }, {
            enabled: debouncedSearch.trim() !== "",
        }
    );

    const selectSearchResult = (searchResult: SearchResult) => {
        const { output } = searchResult;
        setSelectedOutput(output)
        setSearch(output ?? '')
        setPopoverOpen(false)
    }

    return (
        <NavigationMenu className="w-full max-w-none border-white border">
            <Soundcloud className="w-14 h-14 mx-6" />
            <NavigationMenuList className="text-tertiary font-semibold text-sm gap-4">
                <NavigationMenuItem>Home</NavigationMenuItem>
                <NavigationMenuItem>Search</NavigationMenuItem>
                <NavigationMenuItem>Library</NavigationMenuItem>
            </NavigationMenuList>
            <Popover open={searchResults !== undefined && popoverOpen}>
                <PopoverAnchor>
                    <div className="relative w-full mx-4">
                        <Input
                            className="border-none bg-search focus-visible:ring-0 rounded-sm placeholder:font-medium"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setPopoverOpen(true)}
                            onBlur={() => setPopoverOpen(false)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary pointer-events-none" />
                    </div>
                </PopoverAnchor>
                <PopoverContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="w-full bg-white rounded-lg flex flex-col">
                        {searchResults?.collection.map((searchResult: SearchResult, idx: number) => {
                            const { output } = searchResult;
                            return (
                                <div key={idx} className="px-3 py-1 text-black" onClick={() => selectSearchResult(searchResult)}>
                                    {output}
                                </div>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
            
        </NavigationMenu>
    )
}

export { Navbar };
