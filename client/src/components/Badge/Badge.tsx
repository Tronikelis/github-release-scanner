import { ComponentProps, FlowComponent, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const badge = tv({
    base: "border-gray-500 border rounded-lg px-2 py-1 text-sm",
});

type Props = VariantProps<typeof badge> & ComponentProps<"span">;

const Badge: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return <span class={badge({ class: local.class })} {...others} />;
};

export default Badge;
