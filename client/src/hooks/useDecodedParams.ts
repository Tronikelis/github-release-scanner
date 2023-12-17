import { useParams } from "@solidjs/router";

export default function useDecodedParams(): () => ReturnType<typeof useParams> {
    const params = useParams();

    const decoded = () => {
        const p = { ...params };
        return Object.entries(p).reduce(
            (acc, curr) => {
                acc[curr[0]] = decodeURIComponent(curr[1]);
                return acc;
            },
            {} as Record<string, any>
        );
    };

    return decoded;
}
