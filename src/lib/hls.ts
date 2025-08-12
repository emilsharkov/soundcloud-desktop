export const isHlsUrl = (url?: string) => !!url && /\.m3u8($|\?)/i.test(url);

export const canPlayNativeHls = () => {
  if (typeof document === "undefined") return false;
  const a = document.createElement("audio");
  return (
    a.canPlayType("application/vnd.apple.mpegurl") !== "" ||
    a.canPlayType("audio/mpegurl") !== ""
  );
};