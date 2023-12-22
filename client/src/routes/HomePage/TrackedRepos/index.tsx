import { For } from "solid-js";

import Group from "~/components/Group";
import Loader from "~/components/Loader";
import Pagination from "~/components/Pagination";
import Stack from "~/components/Stack";
import TextInput from "~/components/TextInput";
import { useRepositories } from "~/hooks/swr/repository";
import useDebouncedSignal from "~/hooks/useDebouncedSignal";
import usePage from "~/hooks/usePage";
import useSyncSearchParams from "~/hooks/useSyncSearchParams";

import RepositoryItem from "./RepositoryItem";

export default function TrackedRepos() {
    const [page, setPage] = usePage([]);

    const [search, setSearch, lazySearch] = useDebouncedSignal("");
    useSyncSearchParams("search", search, setSearch);

    const { data, isLoading } = useRepositories(
        () => ({
            page: page(),
            search: lazySearch(),
        }),
        { refreshInterval: 5e3, keepPreviousData: true }
    );

    return (
        <Stack>
            <TextInput
                placeholder="Search"
                value={search()}
                onInput={e => setSearch(e.target.value)}
            />

            <Group>
                <Pagination
                    total={data()?.TotalPages || 0}
                    value={page()}
                    setValue={setPage}
                />
                {isLoading() && <Loader />}
            </Group>

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
