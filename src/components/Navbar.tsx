import { SearchResult } from "@/models/response";
import { PopoverAnchor, PopoverContent } from "@radix-ui/react-popover";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import Soundcloud from "../assets/soundcloud.svg?react";
import { Input } from "./ui/input";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Popover } from "./ui/popover";

const Navbar = () => {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounceValue(search, 500);
    const [searchResults,setSearchResults] = useState<SearchResult[] | null>(null)

    useEffect(() => {
        setSearchResults(debouncedSearch !== "" ? [
            {
                output: "fluxxwave",
                query: "fluxxwave"
            },
            {
                output: "fluxxwave",
                query: "fluxxwave"
            }
        ]: null)
    }, [debouncedSearch])

    return (
        <NavigationMenu className="w-full max-w-none border-white border">
            <Soundcloud className="w-14 h-14 mx-6" />
            <NavigationMenuList className="text-tertiary font-semibold text-sm gap-4">
                <NavigationMenuItem>Home</NavigationMenuItem>
                <NavigationMenuItem>Search</NavigationMenuItem>
                <NavigationMenuItem>Library</NavigationMenuItem>
            </NavigationMenuList>
            <Popover open={searchResults !== null}>
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
                        {searchResults?.map((searchResult: SearchResult) => {
                            const { output } = searchResult
                            return (
                                <div className="px-3 py-1 text-black">
                                    {output}
                                </div>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>
            
        </NavigationMenu>
    )
}

export { Navbar };
