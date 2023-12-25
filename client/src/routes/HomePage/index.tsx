import TitleWithPrefix from "~/components/_custom/TitleWithPrefix";
import Group from "~/components/Group";
import Stack from "~/components/Stack";
import Text from "~/components/Text";

import AddRepository from "./AddRepository";
import TrackedRepos from "./TrackedRepos";

export default function HomePage() {
    return (
        <Stack class="gap-8">
            <TitleWithPrefix text="Home" />

            <Group class="justify-end">
                <AddRepository />
            </Group>

            <Stack>
                <Text size="xl">Tracked repositories</Text>
                <TrackedRepos />
            </Stack>
        </Stack>
    );
}
