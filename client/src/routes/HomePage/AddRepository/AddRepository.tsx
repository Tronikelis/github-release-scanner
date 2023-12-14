import { createSignal, VoidComponent } from "solid-js";
import toast from "solid-toast";

import Button from "~/components/Button";
import Group from "~/components/Group";
import TextInput from "~/components/TextInput";
import { useRepositoriesMutation } from "~/hooks/swr/repository";

const AddRepository: VoidComponent = () => {
    const [repoName, setRepoName] = createSignal("");

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
            <TextInput
                placeholder="Repository"
                value={repoName()}
                onInput={e => setRepoName(e.target.value)}
            />
            <Button disabled={add.isTriggering()} onClick={handleAdd}>
                Add
            </Button>
        </Group>
    );
};

export default AddRepository;
