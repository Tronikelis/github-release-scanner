import { ControlledInput } from "solid-controlled-input";
import { ComponentProps, splitProps, VoidComponent } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

import Stack from "../Stack";

const input = tv({
    base: [
        "w-full placeholder-gray-500 rounded-lg border border-gray-200 px-5 py-2.5",
        "text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40",
        "border-gray-600 text-gray-300 focus:border-blue-300 bg-transparent",
    ],
});

type Props = {
    label?: string;
} & ComponentProps<"input"> &
    VariantProps<typeof input>;

const TextInput: VoidComponent<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <Stack class="gap-1">
            <ControlledInput type="text" class={input({ class: local.class })} {...others} />
        </Stack>
    );
};

export default TextInput;
