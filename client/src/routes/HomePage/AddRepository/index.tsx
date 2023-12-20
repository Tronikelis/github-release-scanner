import { createSignal } from "solid-js";
import toast from "solid-toast";

import Button from "~/components/Button";
import Group from "~/components/Group";
import Loader from "~/components/Loader";
import Select from "~/components/Select";
import { useGithubRepositories } from "~/hooks/swr/github";
import { useRepositoriesMutation } from "~/hooks/swr/repository";
import useDebounce from "~/hooks/useDebounce";
import { ForbidChildren } from "~/types/utils";

export default function AddRepository(_props: ForbidChildren) {
    const [repo, setRepo] = createSignal("");

    const [repoName, setRepoName] = createSignal("");
    const [lazyRepoName] = useDebounce(repoName);

    const { data: repositories, isLoading } = useGithubRepositories(
        () => ({
            name: lazyRepoName(),
        }),
        { keepPreviousData: true }
    );

    const { add } = useRepositoriesMutation();

    const handleAdd = async () => {
        if (!repo() && !repoName()) return;

        try {
            await add.trigger({ name: repo() || repoName() });
            add.populateCache();
            setRepo("");
        } catch (err: unknown) {
            toast.error(JSON.stringify(err));
        }
    };

    return (
        <Group>
            <Select
                class="lg:min-w-[320px]"
                value={repo()}
                setValue={setRepo}
                items={repositories()?.Items?.map(x => x.Name) || []}
                inputValue={repoName()}
                setInputValue={setRepoName}
                placeholder="Search github repos"
                rightSection={isLoading() && <Loader />}
            />

            <Button disabled={add.isTriggering()} onClick={handleAdd}>
                Add
            </Button>
        </Group>
    );
}
