import { ComponentProps, FlowComponent, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const group = tv({
    base: "flex flex-row items-center min-w-0 min-h-0 gap-4",
});

type Props = ComponentProps<"div"> & VariantProps<typeof group>;

const Group: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return <div class={group({ class: local.class })} {...others} />;
};

export default Group;
