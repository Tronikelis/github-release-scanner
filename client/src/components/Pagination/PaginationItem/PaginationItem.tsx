import { ComponentProps, Setter } from "solid-js";

import { RequireChildren } from "~/types/utils";

import PaginationButton from "../PaginationButton";

type Props = {
    page: number;
    value: number;
    size: ComponentProps<typeof PaginationButton>["size"];
    setValue: Setter<number>;
};

export default function PaginationItem(props: RequireChildren<Props>) {
    const active = () => props.value === props.page;

    return (
        <PaginationButton
            onClick={() => props.setValue(props.page)}
            isOutlined={!active()}
            size={props.size}
        >
            {props.children}
        </PaginationButton>
    );
}
