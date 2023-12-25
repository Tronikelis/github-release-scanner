import { IconLoader2 } from "@tabler/icons-solidjs";
import { ComponentProps, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

import { ForbidChildren } from "~/types/utils";

const loader = tv({
    base: "size-8 animate-spin",

    variants: {
        size: {
            sm: "size-6",
            lg: "size-12",
        },
    },
});

type Props = VariantProps<typeof loader> & ComponentProps<typeof IconLoader2>;

export default function Loader(props: ForbidChildren<Props>) {
    const [local, others] = splitProps(props, ["class", "size"]);

    return (
        <IconLoader2 class={loader({ class: local.class, size: local.size })} {...others} />
    );
}
