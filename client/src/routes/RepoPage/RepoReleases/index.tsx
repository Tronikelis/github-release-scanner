import { For } from "solid-js";

import Pagination from "~/components/Pagination";
import Stack from "~/components/Stack";
import { useRepositoryReleases } from "~/hooks/swr/repository-release";
import usePage from "~/hooks/usePage";
import { ForbidChildren } from "~/types/utils";

import RepoRelease from "./RepoRelease";

type Props = {
    repoName: string;
};

export default function RepoReleases(props: ForbidChildren<Props>) {
    const [page, setPage] = usePage([]);

    const { data } = useRepositoryReleases(() => ({ name: props.repoName, page: page() }), {
        refreshInterval: 5e3,
    });

    return (
        <Stack class="gap-6">
            <Pagination value={page()} setValue={setPage} total={data()?.TotalPages || 0} />

            <For each={data()?.Rows}>{item => <RepoRelease release={item} />}</For>
        </Stack>
    );
}
