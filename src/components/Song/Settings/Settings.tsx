import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { EditMetadataModal } from "./EditMetadataModal"
import { Track } from "@/models/response";

interface SettingsProps {
    track: Track;
}

const Settings = (props: SettingsProps) => {
    const { track } = props;
    const [editMetadataModalOpen, setEditMetadataModalOpen] = useState<boolean>(false);

    const handleEditMetadata = () => {
        setEditMetadataModalOpen(true);
    }

    const handleAddToPlaylist = () => {
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="hover:bg-transparent cursor-pointer" variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4 text-secondary" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleEditMetadata}>
                        Edit metadata
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.message("Add to playlist", { description: "Coming soon" })}>
                        Add to playlist
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditMetadataModal open={editMetadataModalOpen} onOpenChange={setEditMetadataModalOpen} track={track} />
        </>
    )
}

export { Settings };