import { ComponentProps, FlowComponent, Show, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const text = tv({
    base: "text-base",
    variants: {
        isBold: {
            true: "font-bold",
        },
        isItalic: {
            true: "italic",
        },
        isDimmed: {
            true: "text-gray-400",
        },
        size: {
            sm: "text-sm",
            lg: "text-lg",
            xl: "text-xl",
        },
    },
});

type Props = {
    isSpan?: boolean;
} & (ComponentProps<"p"> | ComponentProps<"span">) &
    VariantProps<typeof text>;

const Text: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, [
        "class",
        "isSpan",
        "isBold",
        "isItalic",
        "isDimmed",
        "size",
    ]);

    const tv = (): Parameters<typeof text>[number] => ({
        class: local.class,
        isBold: local.isBold,
        isItalic: local.isItalic,
        isDimmed: local.isDimmed,
        size: local.size,
    });

    return (
        <Show
            when={local.isSpan}
            fallback={<p class={text(tv())} {...(others as ComponentProps<"p">)} />}
        >
            <span class={text(tv())} {...(others as ComponentProps<"span">)} />
        </Show>
    );
};

export default Text;
