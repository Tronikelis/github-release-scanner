import {
    IconBrandGithub,
    IconCircleCheck,
    IconExclamationCircle,
    IconHourglassEmpty,
    IconMoodEmpty,
} from "@tabler/icons-solidjs";
import { Match, Switch } from "solid-js";
import urlbat from "urlbat";

import Group from "~/components/Group";
import Paper from "~/components/Paper";
import Stack from "~/components/Stack";
import Text from "~/components/Text";
import { ForbidChildren } from "~/types/utils";

type Props = {
    name: string;
    description: string;
    releaseName: string;
    stars: number;
    createdAt: string;
    totalPositives: number;
    isVtFinished: boolean;
    releaseAssetCount: number;
    releaseId: number;
};

export default function RepositoryItem(props: ForbidChildren<Props>) {
    return (
        <Paper>
            <Stack>
                <Group class="gap-2">
                    <a target="_blank" href={`https://github.com/${props.name}`}>
                        <IconBrandGithub size={22} />
                    </a>

                    <Text isTruncated isUnderlinedHover>
                        <a href={urlbat("/repo/:name", { name: props.name })}>{props.name}</a>
                    </Text>
                </Group>

                <Group class="gap-2">
                    <Switch fallback={<IconHourglassEmpty />}>
                        <Match when={props.releaseAssetCount === 0}>
                            <IconMoodEmpty />
                        </Match>
                        <Match when={props.totalPositives > 0}>
                            <Text isSpan color="error">
                                <IconExclamationCircle />
                            </Text>
                        </Match>
                        <Match when={props.isVtFinished && props.totalPositives === 0}>
                            <Text isSpan color="success">
                                <IconCircleCheck />
                            </Text>
                        </Match>
                    </Switch>

                    <Text size="xl" isTruncated isLink>
                        <a
                            href={urlbat("/repo/:name/release/:releaseId", {
                                name: props.name,
                                releaseId: props.releaseId,
                            })}
                        >
                            {props.releaseName}
                        </a>
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
}
