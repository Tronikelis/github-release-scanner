import { ComponentProps, For } from "solid-js";

import Group from "~/components/Group";
import Loader from "~/components/Loader";
import Pagination from "~/components/Pagination";
import Paper from "~/components/Paper";
import Stack from "~/components/Stack";
import Text from "~/components/Text";
import { useRepositoryReleases } from "~/hooks/swr/repository-release";
import usePage from "~/hooks/usePage";
import { ForbidChildren } from "~/types/utils";

type Props = {
    repoName: string;
};

export default function RepoReleases(props: ForbidChildren<Props>) {
    const [page, setPage] = usePage([]);

    const { data } = useRepositoryReleases(() => ({ name: props.repoName, page: page() }), {
        refreshInterval: 5e3,
    });

    const getColor = (positives: number | null): ComponentProps<typeof Text>["color"] => {
        if (typeof positives !== "number") return;
        if (positives === 0) return "success";
        return "error";
    };

    return (
        <Stack class="gap-6">
            <Pagination value={page()} setValue={setPage} total={data()?.TotalPages || 0} />

            <For each={data()?.Rows}>
                {item => (
                    <Paper>
                        <Stack class="gap-2">
                            <Text size="lg" isTruncated>
                                {item.Name}
                            </Text>

                            <Stack class="gap-1">
                                {(!item.ReleaseAssets || item.ReleaseAssets.length === 0) && (
                                    <Text isItalic>
                                        This release does not have any assets 🤷
                                    </Text>
                                )}

                                <For each={item.ReleaseAssets}>
                                    {asset => (
                                        <Group>
                                            {!asset.VtFinished ? (
                                                <Loader />
                                            ) : (
                                                <Text
                                                    color={getColor(asset.Positives)}
                                                    isUnderlined
                                                >
                                                    <a
                                                        target="_blank"
                                                        href={asset.VtLink || ""}
                                                    >
                                                        {asset.Positives}
                                                    </a>
                                                </Text>
                                            )}

                                            <Text isDimmed isUnderlined size="sm">
                                                <a target="_blank" href={asset.GhDownloadUrl}>
                                                    {asset.Name}
                                                </a>
                                            </Text>
                                        </Group>
                                    )}
                                </For>
                            </Stack>
                        </Stack>
                    </Paper>
                )}
            </For>
        </Stack>
    );
}