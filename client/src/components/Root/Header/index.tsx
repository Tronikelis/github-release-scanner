import { IconBrandGithub } from "@tabler/icons-solidjs";

import Group from "~/components/Group";
import Text from "~/components/Text";

export default function Header() {
    return (
        <Group class="w-full">
            <Text size="xl3">
                <a href="/">Github Release Scanner</a>
            </Text>

            <a
                class="ml-auto"
                target="_blank"
                href="https://github.com/Tronikelis/github-release-scanner"
            >
                <IconBrandGithub />
            </a>
        </Group>
    );
}
