import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import Soundcloud from "../assets/soundcloud.svg?react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const Navbar = () => {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounceValue(search, 500);

    useEffect(() => {
        
    }, [debouncedSearch])

    return (
        <NavigationMenu className="w-full max-w-none border-white border">
            <Soundcloud className="w-14 h-14 mx-6" />

            <NavigationMenuList className="text-tertiary font-semibold text-sm gap-4">
                <NavigationMenuItem>Home</NavigationMenuItem>
                <NavigationMenuItem>Search</NavigationMenuItem>
                <NavigationMenuItem>Library</NavigationMenuItem>
            </NavigationMenuList>
            <div className="relative w-full mx-4">
                <Input
                    className="border-none bg-search focus-visible:ring-0 rounded-sm placeholder:font-medium"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary pointer-events-none" />
            </div>
        </NavigationMenu>
    )
}

export { Navbar }