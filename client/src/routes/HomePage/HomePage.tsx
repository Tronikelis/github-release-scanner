import Group from "~/components/Group";
import Stack from "~/components/Stack";
import Text from "~/components/Text";

import AddRepository from "./AddRepository";
import TrackedRepos from "./TrackedRepos";

export default function HomePage() {
    return (
        <Stack class="gap-8">
            <Group class="justify-between flex-wrap">
                <Text size="xl3">🤖 Github release scanner</Text>

                <AddRepository />
            </Group>

            <Stack>
                <Text size="xl">Tracked repositories</Text>
                <TrackedRepos />
            </Stack>
        </Stack>
    );
}
