import { createSignal, VoidComponent } from "solid-js";
import toast from "solid-toast";

import Button from "~/components/Button";
import Group from "~/components/Group";
import Select from "~/components/Select";
import { useGithubRepositories } from "~/hooks/swr/github";
import { useRepositoriesMutation } from "~/hooks/swr/repository";
import useDebounce from "~/hooks/useDebounce";

const AddRepository: VoidComponent = () => {
    const [repo, setRepo] = createSignal("");

    const [repoName, setRepoName] = createSignal("");
    const [lazyRepoName] = useDebounce(repoName);

    const { data: repositories } = useGithubRepositories(() => ({ name: lazyRepoName() }));

    const { add } = useRepositoriesMutation();

    const handleAdd = async () => {
        try {
            await add.trigger({ name: repoName() });
            add.populateCache();
        } catch (err: unknown) {
            toast.error(JSON.stringify(err));
        }
    };

    return (
        <Group>
            <Select
                value={repo()}
                setValue={setRepo}
                items={repositories()?.Items?.map(x => x.Name) || []}
                inputValue={repoName()}
                setInputValue={setRepoName}
            />

            <Button disabled={add.isTriggering()} onClick={handleAdd}>
                Add
            </Button>
        </Group>
    );
};

export default AddRepository;
