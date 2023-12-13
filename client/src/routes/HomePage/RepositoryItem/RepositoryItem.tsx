import { Match, Switch, VoidComponent } from "solid-js";

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
};

const RepositoryItem: VoidComponent<Props> = props => {
    return (
        <Paper>
            <Stack class="gap-2">
                <Text>{props.name}</Text>

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
                    <Text size="xl">{props.releaseName}</Text>
                </Group>
            </Stack>
        </Paper>
    );
};

export default RepositoryItem;
