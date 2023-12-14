import { VoidComponent } from "solid-js";

import Button from "~/components/Button";
import Dropdown from "~/components/Dropdown";

const AddRepository: VoidComponent = () => {
    let ref: HTMLButtonElement | undefined;

    return (
        <>
            <Button ref={ref}>Hello</Button>
            <Dropdown targetRef={() => ref}>Hello guys</Dropdown>
        </>
    );
};

export default AddRepository;
