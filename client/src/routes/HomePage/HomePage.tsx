import { VoidComponent } from "solid-js";

import Group from "~/components/Group";
import Stack from "~/components/Stack";
import Text from "~/components/Text";

import AddRepository from "./AddRepository";
import TrackedRepos from "./TrackedRepos";

const HomePage: VoidComponent = () => {
    return (
        <Stack class="gap-8">
            <Group class="justify-between">
                <Text size="xl3">🤖 Github release scanner</Text>

                <AddRepository />
            </Group>

            <Stack>
                <Text size="xl">Tracked repositories</Text>
                <TrackedRepos />
            </Stack>
        </Stack>
    );
};

export default HomePage;
