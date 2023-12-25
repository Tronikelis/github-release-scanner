import { ComponentProps, FlowComponent, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const stack = tv({
    base: "flex flex-col min-w-0 min-h-0 gap-4",
});

type Props = ComponentProps<"div"> & VariantProps<typeof stack>;

const Stack: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return <div class={stack({ class: local.class })} {...others} />;
};

export default Stack;
