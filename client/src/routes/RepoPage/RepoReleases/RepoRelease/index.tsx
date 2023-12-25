import { ComponentProps, For } from "solid-js";

import Group from "~/components/Group";
import Loader from "~/components/Loader";
import Paper from "~/components/Paper";
import Stack from "~/components/Stack";
import Text from "~/components/Text";
import { useRepositoryReleases } from "~/hooks/swr/repository-release";
import { ExtractSwrData } from "~/hooks/swr/types";
import { ForbidChildren } from "~/types/utils";
import { formatBytes } from "~/utils";

type Props = {
    release: ExtractSwrData<typeof useRepositoryReleases>["Rows"][number];
};

export default function RepoRelease(props: ForbidChildren<Props>) {
    const getColor = (positives: number | null): ComponentProps<typeof Text>["color"] => {
        if (typeof positives !== "number") return;
        if (positives === 0) return "success";
        return "error";
    };

    return (
        <Paper>
            <Stack class="gap-2">
                <Text size="lg" isTruncated>
                    {props.release.Name}
                </Text>

                <Stack class="gap-1">
                    {(!props.release.ReleaseAssets ||
                        props.release.ReleaseAssets.length === 0) && (
                        <Text isItalic>This release does not have any assets 🤷</Text>
                    )}

                    <For each={props.release.ReleaseAssets}>
                        {asset => (
                            <Group class="*:hover:opacity-60">
                                {!asset.VtFinished ? (
                                    <Loader />
                                ) : (
                                    <Text color={getColor(asset.Positives)} isUnderlined>
                                        <a target="_blank" href={asset.VtLink || ""}>
                                            {asset.Positives}
                                        </a>
                                    </Text>
                                )}

                                <Text isDimmed isUnderlined isTruncated size="sm">
                                    <a target="_blank" href={asset.GhDownloadUrl}>
                                        {asset.Name}
                                    </a>
                                </Text>

                                <Text class="ml-auto whitespace-nowrap" size="sm" isDimmed>
                                    {formatBytes(asset.Size)}
                                </Text>
                            </Group>
                        )}
                    </For>
                </Stack>
            </Stack>
        </Paper>
    );
}
