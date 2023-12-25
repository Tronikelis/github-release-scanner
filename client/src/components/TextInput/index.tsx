import clsx from "clsx";
import { ControlledInput } from "solid-controlled-input";
import { ComponentProps, JSX, Setter, splitProps, VoidComponent } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

import Group from "../Group";
import Stack from "../Stack";
import Text from "../Text";

const input = tv({
    base: [
        "placeholder-gray-500 rounded-lg border border-gray-200 px-5 py-2.5",
        "text-gray-700 focus-within:border-blue-400 focus-within:outline-none",
        "border-gray-600 text-gray-300 bg-transparent",
    ],
});

type Props = {
    label?: string;
    leftSection?: JSX.Element;
    rightSection?: JSX.Element;
    containerRef?: Setter<HTMLDivElement | undefined>;
} & ComponentProps<"input"> &
    VariantProps<typeof input>;

const TextInput: VoidComponent<Props> = props => {
    const [local, others] = splitProps(props, [
        "class",
        "leftSection",
        "rightSection",
        "label",
        "containerRef",
    ]);

    return (
        <Stack ref={local.containerRef} class={clsx(local.class, "gap-1")}>
            {local.label && (
                <Text size="sm" isDimmed>
                    {local.label}
                </Text>
            )}

            <Group class={clsx(input(), "gap-2 flex-nowrap relative")}>
                {local.leftSection}

                <ControlledInput
                    type="text"
                    class="outline-none border-none bg-transparent pr-5 flex-1"
                    {...others}
                />

                {local.rightSection && (
                    <div class="w-10 h-full absolute top-0 right-0 bottom-0 flex items-center justify-center">
                        {local.rightSection}
                    </div>
                )}
            </Group>
        </Stack>
    );
};

export default TextInput;
