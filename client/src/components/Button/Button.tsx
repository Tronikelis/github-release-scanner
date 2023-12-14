import { Component, ComponentProps, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
    base: [
        "hover:bg-blue-500 bg-blue-600",
        "focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80",
        "capitalize transition-colors duration-300 transform",
        "rounded-lg font-medium tracking-wide text-white ",
    ],
});

type Props = ComponentProps<"button"> & VariantProps<typeof button>;

const Button: Component<Props> = props => {
    const [local, others] = splitProps(props, ["class"]);

    return <button class={button({ class: local.class })} {...others} />;
};

export default Button;
