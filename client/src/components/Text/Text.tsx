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
        isTruncated: {
            true: "truncate",
        },
        isLink: {
            true: "text-blue-600 hover:underline no-underline hover:cursor-pointer w-fit",
        },
        size: {
            sm: "text-sm",
            lg: "text-lg",
            xl: "text-xl",
            xl2: "text-2xl",
            xl3: "text-3xl",
            xl4: "text-4xl",
            xl5: "text-5xl",
            xl6: "text-6xl",
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
        "isTruncated",
        "size",
        "isLink",
    ]);

    const tv = (): Parameters<typeof text>[number] => ({
        class: local.class,
        isBold: local.isBold,
        isItalic: local.isItalic,
        isDimmed: local.isDimmed,
        isTruncated: local.isTruncated,
        size: local.size,
        isLink: local.isLink,
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
