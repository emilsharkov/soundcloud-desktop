import { PagingCollection, SearchResult, Track } from "@/models/response";
import { PopoverAnchor, PopoverContent } from "./ui/popover";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import Soundcloud from "../assets/soundcloud.svg?react";
import { Input } from "./ui/input";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Popover } from "./ui/popover";
import { useTauriInvoke } from "@/hooks/useTauriInvoke";

interface SearchArgs {
    q: string;
}

const Navbar = () => {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);

    const { data: searchResults } = useTauriInvoke<SearchArgs,PagingCollection<SearchResult>>(
        "search_results", { 
            q: debouncedSearch 
        }, {
            enabled: debouncedSearch.trim() !== "",
        }
    );

    const { data: tracks } = useTauriInvoke<SearchArgs,PagingCollection<Track>>(
        "search_tracks", { 
            q: selectedOutput ?? ""
        }, {
            enabled: selectedOutput !== undefined,
        }
    );    

    console.log(tracks);

    return (
        <NavigationMenu className="w-full max-w-none border-white border">
            <Soundcloud className="w-14 h-14 mx-6" />
            <NavigationMenuList className="text-tertiary font-semibold text-sm gap-4">
                <NavigationMenuItem>Home</NavigationMenuItem>
                <NavigationMenuItem>Search</NavigationMenuItem>
                <NavigationMenuItem>Library</NavigationMenuItem>
            </NavigationMenuList>
            <Popover open={search.trim() !== "" && searchResults !== null}>
                <PopoverAnchor>
                    <div className="relative w-full mx-4">
                        <Input
                            className="border-none bg-search focus-visible:ring-0 rounded-sm placeholder:font-medium"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary pointer-events-none" />
                    </div>
                </PopoverAnchor>
                <PopoverContent>
                    <div className="w-full bg-white rounded-lg flex flex-col">
                        {searchResults?.collection.map((searchResult: SearchResult, idx: number) => {
                            const { output } = searchResult;
                            return (
                                <div key={idx} className="px-3 py-1 text-black" onClick={() => setSelectedOutput(output)}>
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
