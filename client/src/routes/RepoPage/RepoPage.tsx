import { IconBrandGithub } from "@tabler/icons-solidjs";

import FormattedDate from "~/components/_custom/FormattedDate";
import Group from "~/components/Group";
import Paper from "~/components/Paper";
import Stack from "~/components/Stack";
import Text from "~/components/Text";
import { useRepository } from "~/hooks/swr/repository";
import useDecodedParams from "~/hooks/useDecodedParams";

import RepoReleases from "./RepoReleases";

export default function RepoPage() {
    const params = useDecodedParams();
    const repoName = () => params().repoName;

    const { data } = useRepository(() => {
        const rn = repoName();
        if (!rn) return;
        return { name: rn };
    });

    return (
        <Stack class="gap-8">
            <Paper>
                <Group class="flex-wrap lg:flex-nowrap">
                    <Group class="gap-2">
                        <a target="_blank" href={`https://github.com/${repoName()}`}>
                            <IconBrandGithub />
                        </a>
                        <Text size="lg">{data()?.Name}</Text>
                    </Group>

                    <Text>⭐ {data()?.Stars}</Text>

                    <Text isDimmed isTruncated>
                        {data()?.Description}
                    </Text>

                    <Text isDimmed isItalic class="ml-auto">
                        Tracking since <FormattedDate date={data()?.CreatedAt} timeAgo /> ago
                    </Text>
                </Group>
            </Paper>

            {repoName() && <RepoReleases repoName={repoName()!} />}
        </Stack>
    );
}
