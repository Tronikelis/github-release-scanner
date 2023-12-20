import { ComponentProps, FlowComponent, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const container = tv({
    slots: {
        base: "w-full flex items-center justify-center my-12 px-4",
        inner: "container",
    },
});

type Props = ComponentProps<"div"> & VariantProps<typeof container>;

const Container: FlowComponent<Props> = props => {
    const { base, inner } = container();

    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <div class={base({ class: local.class })} {...others}>
            <div class={inner()}>{local.children}</div>
        </div>
    );
};

export default Container;
