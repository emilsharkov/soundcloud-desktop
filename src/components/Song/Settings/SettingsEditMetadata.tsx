import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    UpdateLocalTrackResponse,
    UpdateLocalTrackResponseSchema,
} from '@/types/schemas';
import {
    UpdateLocalTrackQuery,
    UpdateLocalTrackQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSettingsContext } from './Settings';

const SettingsEditMetadata = () => {
    const {
        trackId,
        title: initialTitle,
        artist: initialArtist,
    } = useSettingsContext();
    const [editMetadataModalOpen, setEditMetadataModalOpen] =
        useState<boolean>(false);
    const [title, setTitle] = useState<string>(initialTitle);
    const [artist, setArtist] = useState<string>(initialArtist);
    const [artwork, setArtwork] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const { mutate: updateTrack } = useTauriMutation<
        UpdateLocalTrackQuery,
        UpdateLocalTrackResponse
    >('update_local_track', {
        querySchema: UpdateLocalTrackQuerySchema,
        responseSchema: UpdateLocalTrackResponseSchema,
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
            setEditMetadataModalOpen(false);
        },
    });

    const handleSelect = (e: Event) => {
        e.preventDefault();
        // Use a small delay to allow dropdown to close smoothly
        requestAnimationFrame(() => {
            setEditMetadataModalOpen(true);
        });
    };

    const handleOpenChange = (open: boolean) => {
        setEditMetadataModalOpen(open);
    };

    // Reset form when modal opens
    useEffect(() => {
        if (editMetadataModalOpen) {
            setTitle(initialTitle);
            setArtist(initialArtist);
            setArtwork(undefined);
        }
    }, [editMetadataModalOpen, initialTitle, initialArtist]);

    // Prevent space key from bubbling to parent components when dialog is open
    useEffect(() => {
        if (!editMetadataModalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent space key from bubbling to parent components (like SortableItem)
            if (e.key === ' ' || e.key === 'Spacebar') {
                // Only stop propagation if the target is not an input/textarea
                const target = e.target as HTMLElement;
                if (
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable
                ) {
                    // Allow space in inputs, but stop it from bubbling
                    e.stopPropagation();
                } else {
                    // Prevent space key entirely for other elements
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        // Use capture phase to catch events before they reach parent components
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [editMetadataModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const query: UpdateLocalTrackQuery = {
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
        <>
            <DropdownMenuItem onSelect={handleSelect}>
                Edit metadata
            </DropdownMenuItem>
            <Dialog
                open={editMetadataModalOpen}
                onOpenChange={handleOpenChange}
                modal={true}
            >
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
                                onClick={() => setEditMetadataModalOpen(false)}
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
        </>
    );
};

export { SettingsEditMetadata };
