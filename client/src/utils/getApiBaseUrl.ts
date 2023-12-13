export function getApiBaseUrl() {
    if (import.meta.env.PROD) {
        return "/v1";
    }

    return "http://localhost:3001/v1";
}
