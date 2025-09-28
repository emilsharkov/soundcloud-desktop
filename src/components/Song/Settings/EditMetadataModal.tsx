import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTauriMutation } from '@/hooks/data/mutation/useTauriMutation';
import { UpdateTrackQuery } from '@/models/query';
import { useQueryClient } from '@tanstack/react-query';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface EditMetadataModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trackId: number;
    title: string;
    artist: string;
}

const EditMetadataModal = (props: EditMetadataModalProps) => {
    const {
        open,
        onOpenChange,
        trackId,
        title: initialTitle,
        artist: initialArtist,
    } = props;
    const [title, setTitle] = useState<string>(initialTitle);
    const [artist, setArtist] = useState<string>(initialArtist);
    const [artwork, setArtwork] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const { mutate: updateTrack } = useTauriMutation<UpdateTrackQuery, void>(
        'update_local_track',
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['get_local_tracks'],
                });
                await queryClient.invalidateQueries({
                    queryKey: ['get_local_track', trackId],
                });
                toast.success('Metadata updated successfully');
            },
            onError: () => {
                toast.error('Failed to update metadata');
            },
            onSettled: () => {
                setIsSubmitting(false);
                onOpenChange(false);
            },
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const query: UpdateTrackQuery = {
            id: trackId,
        };
        if (title) {
            query.title = title;
        }
        if (artist) {
            query.artist = artist;
        }
        if (artwork) {
            query.artwork = artwork;
        }
        updateTrack(query);
    };

    const handleSelectArtwork = async () => {
        const result: string | null = await openDialog({
            directory: false,
            multiple: false,
            filters: [
                {
                    name: 'Images',
                    extensions: [
                        'jpg',
                        'jpeg',
                        'png',
                        'gif',
                        'bmp',
                        'webp',
                        'tiff',
                        'tif',
                    ],
                },
            ],
        });
        if (result && result !== '') {
            setArtwork(result);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Edit Metadata</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                            id='title'
                            type='text'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder='Enter track title'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='artist'>Artist</Label>
                        <Input
                            id='artist'
                            type='text'
                            value={artist}
                            onChange={e => setArtist(e.target.value)}
                            placeholder='Enter artist name'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='artwork'>Artwork URL</Label>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleSelectArtwork}
                        >
                            <p className='text-sm text-ellipsis'>
                                {artwork !== undefined
                                    ? artwork
                                    : 'Select Artwork'}
                            </p>
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export { EditMetadataModal };
