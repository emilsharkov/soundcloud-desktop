const getArtwork = async (artwork_url: string | null): Promise<string> => {
    const largeArtwork = artwork_url?.replace('large', 't1080x1080');

    if (largeArtwork) {
        const response = await fetch(largeArtwork);
        if (response.ok) {
            return largeArtwork;
        }
    }

    if (artwork_url) return artwork_url;

    return '';
};

export { getArtwork };
