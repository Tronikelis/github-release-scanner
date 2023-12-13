import React, { ComponentProps } from "react";
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
            true: "text-default-500",
        },
        size: {
            tiny: "text-tiny",
            small: "text-small",
            large: "text-large",
        },
    },
});

type Props = {
    isSpan?: boolean;
} & (ComponentProps<"p"> | ComponentProps<"span">) &
    VariantProps<typeof text>;

const Text = ({ isSpan, isBold, isItalic, isDimmed, size, className, ...others }: Props) => {
    const tv = {
        isSpan,
        isBold,
        isItalic,
        isDimmed,
        size,
        className,
    };

    if (isSpan) {
        return <span className={text(tv)} {...others} />;
    }

    return <p className={text(tv)} {...(others as ComponentProps<"p">)} />;
};

export default Text;
