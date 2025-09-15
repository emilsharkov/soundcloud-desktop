import { LoaderCircle, LucideDownload } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Track } from "@/models/response";

interface DownloadProps {
    track: Track;
}

const Download = (props: DownloadProps) => {
    const { track } = props;
    const [downloading, setDownloading] = useState<boolean>(false);

    const handleDownload = async () => {
        setDownloading(true);
        invoke(
            "download_track", { track }
        ).then(() => {
            toast.success("Downloaded successfully");
        }).catch(() => {
            toast.error("Failed to download");
        }).finally(() => {
            setDownloading(false);
        });
    };

    return (
        <Button 
            className="hover:bg-transparent cursor-pointer" 
            size="icon" 
            variant="ghost" 
            onClick={handleDownload}
            disabled={downloading} 
        >
            {downloading ? (
                <LoaderCircle className="w-4 h-4 text-secondary animate-spin" />
            ) : (
                <LucideDownload className="w-4 h-4 text-secondary" />
            )}
        </Button>
    )
}

export { Download };