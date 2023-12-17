import { Match, Switch, VoidComponent } from "solid-js";
import urlbat from "urlbat";

import Group from "~/components/Group";
import Paper from "~/components/Paper";
import Stack from "~/components/Stack";
import Text from "~/components/Text";

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

const RepositoryItem: VoidComponent<Props> = props => {
    return (
        <Paper>
            <Stack class="gap-2">
                <Text isTruncated isLink>
                    <a href={urlbat("/repo/:name", { name: props.name })}>{props.name}</a>
                </Text>

                <Group>
                    <Text size="xl">
                        <Switch fallback="⏳">
                            <Match when={props.releaseAssetCount === 0}>😶</Match>
                            <Match when={props.totalPositives > 0}>❌</Match>
                            <Match when={props.isVtFinished && props.totalPositives === 0}>
                                ✅
                            </Match>
                        </Switch>
                    </Text>
                    <Text size="xl" isTruncated isLink>
                        <a
                            href={urlbat("/repo/:name/release/:id", {
                                name: props.name,
                                id: props.releaseId,
                            })}
                        >
                            {props.releaseName}
                        </a>
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
};

export default RepositoryItem;
