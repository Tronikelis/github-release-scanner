/* eslint-disable solid/components-return-once */
import {
    IconAlertTriangle,
    IconBrandGithub,
    IconCircleCheck,
    IconExclamationCircle,
    IconHourglassEmpty,
    IconMoodEmpty,
} from "@tabler/icons-solidjs";
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
    const renderIcon = () => {
        if (props.releaseAssetCount === 0) {
            return <IconMoodEmpty />;
        }

        if (!props.isVtFinished) {
            return <IconHourglassEmpty />;
        }

        if (props.totalPositives === 0) {
            return (
                <Text isSpan color="success">
                    <IconCircleCheck />
                </Text>
            );
        }

        if (props.totalPositives <= 5) {
            return (
                <Text isSpan color="warning">
                    <IconAlertTriangle />
                </Text>
            );
        }

        if (props.totalPositives > 5) {
            return (
                <Text color="error" isSpan>
                    <IconExclamationCircle />
                </Text>
            );
        }

        return <IconHourglassEmpty />;
    };

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
                    {renderIcon()}

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
