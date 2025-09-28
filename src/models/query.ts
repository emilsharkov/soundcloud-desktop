export interface Paging {
    limit?: number;
    offset?: number;
    linked_partitioning?: boolean;
}

export interface SearchArgs {
    q: string;
}

export interface IdQuery {
    id: number;
}

export interface UpdateTrackQuery {
    id: number;
    title?: string;
    artist?: string;
    artwork?: string;
}
