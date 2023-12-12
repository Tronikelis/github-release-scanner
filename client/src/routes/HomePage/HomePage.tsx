import { For, VoidComponent } from "solid-js";

import Container from "~/components/Container";
import Stack from "~/components/Stack";
import { useRepositories } from "~/hooks/swr/repository";

import RepositoryItem from "./RepositoryItem";

const HomePage: VoidComponent = () => {
    const { data } = useRepositories({
        refreshInterval: 5e3,
    });

    return (
        <Container>
            <Stack class="gap-8">
                <For each={data()?.Rows}>
                    {item => (
                        <RepositoryItem
                            releaseAssetCount={item.Releases[0]?.ReleaseAssets.length ?? 0}
                            isVtFinished={
                                item.Releases[0]?.ReleaseAssets.every(
                                    item => item.VtFinished
                                ) ?? false
                            }
                            totalPositives={
                                item.Releases[0]?.ReleaseAssets.reduce(
                                    (prev, acc) => (acc.Positives ?? 0) + prev,
                                    0
                                ) ?? 0
                            }
                            name={item.Name}
                            createdAt={item.CreatedAt}
                            description={item.Description || ""}
                            releaseName={item.Releases[0]?.Name || ""}
                            stars={item.Stars}
                        />
                    )}
                </For>
            </Stack>
        </Container>
    );
};

export default HomePage;
