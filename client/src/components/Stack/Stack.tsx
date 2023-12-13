import React, { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const stack = tv({
    base: "flex flex-col gap-4",
});

type Props = ComponentProps<"div"> & VariantProps<typeof stack>;

const Stack = ({ className, ...others }: Props) => {
    return <div className={stack({ className })} {...others} />;
};

export default Stack;
