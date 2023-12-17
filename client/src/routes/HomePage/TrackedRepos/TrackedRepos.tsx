import { For } from "solid-js";

import Pagination from "~/components/Pagination";
import Stack from "~/components/Stack";
import { useRepositories } from "~/hooks/swr/repository";
import usePage from "~/hooks/usePage";

import RepositoryItem from "./RepositoryItem";

export default function TrackedRepos() {
    const [page, setPage] = usePage([]);

    const { data } = useRepositories(
        () => ({
            page: page(),
        }),
        { refreshInterval: 5e3 }
    );

    return (
        <Stack>
            <Pagination total={data()?.TotalPages || 0} value={page()} setValue={setPage} />

            <Stack class="gap-8 grid grid-cols-1 lg:grid-cols-4">
                <For each={data()?.Rows}>
                    {item => (
                        <RepositoryItem
                            releaseAssetCount={item.Releases?.[0]?.ReleaseAssets?.length ?? 0}
                            isVtFinished={
                                item.Releases?.[0]?.ReleaseAssets?.every(
                                    item => item.VtFinished
                                ) ?? false
                            }
                            totalPositives={
                                item.Releases?.[0]?.ReleaseAssets?.reduce(
                                    (prev, acc) => (acc.Positives ?? 0) + prev,
                                    0
                                ) ?? 0
                            }
                            name={item.Name}
                            createdAt={item.CreatedAt}
                            description={item.Description || ""}
                            releaseName={item.Releases?.[0]?.Name || ""}
                            stars={item.Stars}
                        />
                    )}
                </For>
            </Stack>
        </Stack>
    );
}
