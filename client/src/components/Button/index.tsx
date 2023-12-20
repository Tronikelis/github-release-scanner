import { Component, ComponentProps, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
    base: [
        "flex items-center justify-center flex-nowrap",
        "bg-blue-600 hover:bg-blue-500",
        "min-w-fit",
        "border-2 border-solid border-blue-600 hover:border-blue-500",
        "rounded-lg",
        "transform transition-transform active:scale-95",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "px-4 py-2",
    ],
    variants: {
        color: {
            dimmed: "hover:bg-slate-500 hover:border-slate-500 bg-slate-600 border-slate-600",
        },
        size: {
            sm: "h-8 w-8 text-sm",
        },
        isOutlined: {
            true: "bg-transparent",
        },
        isSquare: {
            true: "p-1",
        },
    },
});

type Props = VariantProps<typeof button> & ComponentProps<"button">;

const Button: Component<Props> = props => {
    const [local, others] = splitProps(props, [
        "class",
        "isOutlined",
        "color",
        "size",
        "isSquare",
    ]);

    return (
        <button
            class={button({
                class: local.class,
                isOutlined: local.isOutlined,
                color: local.color,
                size: local.size,
                isSquare: local.isSquare,
            })}
            {...others}
        />
    );
};

export default Button;
