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
                    {item => {
                        const release = item.Releases?.at(0);

                        return (
                            <RepositoryItem
                                releaseId={release?.ID ?? 0}
                                releaseAssetCount={release?.ReleaseAssets?.length ?? 0}
                                isVtFinished={
                                    release?.ReleaseAssets?.every(item => item.VtFinished) ??
                                    false
                                }
                                totalPositives={
                                    release?.ReleaseAssets?.reduce(
                                        (prev, acc) => (acc.Positives ?? 0) + prev,
                                        0
                                    ) ?? 0
                                }
                                name={item.Name}
                                createdAt={item.CreatedAt}
                                description={item.Description || ""}
                                releaseName={release?.Name || ""}
                                stars={item.Stars}
                            />
                        );
                    }}
                </For>
            </Stack>
        </Stack>
    );
}
