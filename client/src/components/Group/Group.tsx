import React, { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const group = tv({
    base: "flex flex-row items-center gap-4",
});

type Props = ComponentProps<"div"> & VariantProps<typeof group>;

const Group = ({ className, ...others }: Props) => {
    return <div className={group({ className })} {...others} />;
};

export default Group;
