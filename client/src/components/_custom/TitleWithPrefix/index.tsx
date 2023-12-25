import { Title } from "@solidjs/meta";
import { ComponentProps, splitProps } from "solid-js";

import { ForbidChildren } from "~/types/utils";

type Props = {
    text: string;
} & ComponentProps<typeof Title>;

export default function TitleWithPrefix(props: ForbidChildren<Props>) {
    const [local, others] = splitProps(props, ["text"]);

    return <Title {...others}>{`${local.text} | Github Release Scanner`}</Title>;
}
