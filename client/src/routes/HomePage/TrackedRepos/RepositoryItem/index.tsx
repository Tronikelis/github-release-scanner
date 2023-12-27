import { trackDeep } from "@solid-primitives/deep";
import {
    IconAlertTriangle,
    IconBrandGithub,
    IconCircleCheck,
    IconExclamationCircle,
    IconHourglassEmpty,
    IconMoodEmpty,
} from "@tabler/icons-solidjs";
import { match, P } from "ts-pattern";
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
                    <IconBrandGithub size={22} />

                    <Text isTruncated isUnderlinedHover>
                        <a target="_blank" href={`https://github.com/${props.name}`}>
                            {props.name}
                        </a>
                    </Text>
                </Group>

                <Group class="gap-2">
                    {match(trackDeep(props))
                        .with({ releaseAssetCount: 0 }, () => <IconMoodEmpty />)
                        .with({ isVtFinished: false }, () => <IconHourglassEmpty />)
                        .with({ totalPositives: 0 }, () => (
                            <Text isSpan color="success">
                                <IconCircleCheck />
                            </Text>
                        ))
                        .with({ totalPositives: P.number.between(1, 5) }, () => (
                            <Text isSpan color="warning">
                                <IconAlertTriangle />
                            </Text>
                        ))
                        .with({ totalPositives: P.number.gt(5) }, () => (
                            <Text color="error" isSpan>
                                <IconExclamationCircle />
                            </Text>
                        ))
                        .otherwise(() => (
                            <IconHourglassEmpty />
                        ))}

                    <Text size="xl" isTruncated isLink>
                        <a href={urlbat("/repo/:name", { name: props.name })}>
                            {props.releaseName}
                        </a>
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
}
