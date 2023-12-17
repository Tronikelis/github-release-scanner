import { createEventListener } from "@solid-primitives/event-listener";
import { mergeRefs } from "@solid-primitives/refs";
import {
    ComponentProps,
    createSignal,
    For,
    Setter,
    splitProps,
    VoidComponent,
} from "solid-js";

import useClickOutside from "~/hooks/useClickOutside";

import Badge from "../Badge";
import Dropdown from "../Dropdown";
import Paper from "../Paper";
import Stack from "../Stack";
import Text from "../Text";
import TextInput from "../TextInput";

type Props = {
    inputValue?: string;
    setInputValue?: Setter<string>;

    value: string;
    setValue: Setter<string>;
    items: string[];
} & ComponentProps<typeof TextInput>;

const Select: VoidComponent<Props> = props => {
    const [local, others] = splitProps(props, [
        "value",
        "setValue",
        "items",
        "inputValue",
        "setInputValue",
        "ref",
    ]);

    const [isDropdownOpened, setIsDropdownOpened] = createSignal(false);

    const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>();
    let inputRef: HTMLInputElement | undefined;
    let dropdownRef: HTMLDivElement | undefined;

    const handleOpen = () => setIsDropdownOpened(true);
    const handleClose = () => setIsDropdownOpened(false);

    createEventListener(() => inputRef, "focus", handleOpen);
    useClickOutside(() => [containerRef(), dropdownRef, inputRef], handleClose);

    const handleSelect = (item: string) => {
        setIsDropdownOpened(false);
        local.setValue(item);
        local.setInputValue?.("");
    };

    return (
        <>
            <TextInput
                value={local.inputValue}
                onInput={e => local.setInputValue?.(e.target.value)}
                containerRef={setContainerRef}
                ref={mergeRefs(local.ref, el => (inputRef = el))}
                leftSection={local.value && <Badge>{local.value}</Badge>}
                {...others}
            />

            <Dropdown
                isFullWidth
                isOpened={isDropdownOpened()}
                ref={dropdownRef}
                targetRef={containerRef}
            >
                <Paper class="p-0 overflow-auto max-h-96">
                    <Stack class="gap-1">
                        <For each={local.items}>
                            {item => (
                                <Paper
                                    onClick={() => handleSelect(item)}
                                    class="hover:cursor-pointer"
                                >
                                    <Text class="truncate">{item}</Text>
                                </Paper>
                            )}
                        </For>
                    </Stack>
                </Paper>
            </Dropdown>
        </>
    );
};

export default Select;
