export function formatBytes(bytes: number) {
    if (bytes <= 0) return "0mb";

    const k = 1000;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
}
