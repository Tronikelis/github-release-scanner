import { IconLoader2 } from "@tabler/icons-solidjs";
import { ComponentProps, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

import { ForbidChildren } from "~/types/utils";

const loader = tv({
    base: "size-8 animate-spin",
});

type Props = ComponentProps<typeof IconLoader2> & VariantProps<typeof loader>;

export default function Loader(props: ForbidChildren<Props>) {
    const [local, others] = splitProps(props, ["class"]);

    return <IconLoader2 class={loader({ class: local.class })} {...others} />;
}
