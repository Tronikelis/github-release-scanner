import { ComponentProps, FlowComponent, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const paper = tv({
    base: ["px-8 py-4", "bg-stone-900", "rounded-lg shadow-md"],
});

type Props = ComponentProps<"div"> & VariantProps<typeof paper>;

const Paper: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return <div class={paper({ class: local.class })} {...others} />;
};

export default Paper;
