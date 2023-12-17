export function getApiBaseUrl() {
    if (import.meta.env.PROD) {
        return "/api/v1";
    }

    return "http://localhost:3001/api/v1";
}
