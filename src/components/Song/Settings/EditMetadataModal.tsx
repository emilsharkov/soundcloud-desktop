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
import { Track } from '@/models/response';
import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';
import { toast } from 'sonner';

interface EditMetadataModalProps {
    track: Track;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditMetadataModal = (props: EditMetadataModalProps) => {
    const { open, onOpenChange, track } = props;
    const { id, title: initialTitle, user } = track;
    const initialArtist = user?.username;
    const [title, setTitle] = useState(initialTitle);
    const [artist, setArtist] = useState(initialArtist);
    const [artworkUrl, setArtworkUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            console.error('No track ID provided');
            throw new Error('No track ID provided');
        }

        setIsSubmitting(true);

        try {
            await invoke('update_local_track', {
                id: id,
                title: title || null,
                artist: artist || null,
                artwork: artworkUrl || null,
            });

            onOpenChange(false);

            setTitle(initialTitle);
            setArtist(initialArtist);
            setArtworkUrl('');

            toast.success('Metadata updated successfully');
        } catch (error) {
            toast.error('Failed to update metadata');
            console.error('Failed to update metadata:', error);
        } finally {
            setIsSubmitting(false);
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
                        <Input
                            id='artwork'
                            type='file'
                            value={artworkUrl}
                            onChange={e => setArtworkUrl(e.target.value)}
                            placeholder='Enter artwork URL'
                        />
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
