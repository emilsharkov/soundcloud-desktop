// Query models translated from soundcloud-rs (Rust) to TypeScript

export interface AlbumQuery {
    q?: string;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface PlaylistsQuery {
    q?: string;
    access?: string;
    show_tracks?: boolean;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface SearchResultsQuery {
    q?: string;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface SearchAllQuery {
    q?: string;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface TracksQuery {
    q?: string;
    ids?: string;
    urns?: string;
    genres?: string;
    tags?: string;
    bpm?: string;
    duration?: string;
    created_at?: string;
    access?: string;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface TrackWaveformQuery {
    trackId: number;
}

export interface Paging {
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface UsersQuery {
    q?: string;
    ids?: string;
    urns?: string;
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface TrackIdQuery {
    id: number;
}

export interface UpdateTrackQuery {
    id: number;
    title: string;
    artist: string;
    artwork: string | null;
}
