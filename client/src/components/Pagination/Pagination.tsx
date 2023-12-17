import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-solidjs";
import { ComponentProps, Index, mergeProps, Setter, Show, splitProps } from "solid-js";
import { tv, VariantProps } from "tailwind-variants";

import { ForbidChildren } from "~/types/utils";

import Group from "../Group";

import PaginationButton from "./PaginationButton";
import PaginationItem from "./PaginationItem";

const pagination = tv({
    base: "gap-2 flex-nowrap",
});

type Props = {
    total: number;

    boundaries?: number;
    siblings?: number;
    size?: ComponentProps<typeof PaginationButton>["size"];

    /** STARTS AT 0 LIKE ARRAYS */
    value: number;
    /** STARTS AT 0 LIKE ARRAYS */
    setValue: Setter<number>;
} & VariantProps<typeof pagination> &
    ComponentProps<typeof Group>;

export default function Pagination(_props: ForbidChildren<Props>) {
    const CHEVRON_SIZE = 20;

    const DOTS = "dots" as const;
    type Range = (number | typeof DOTS)[];

    const props = mergeProps(
        { boundaries: 1, siblings: 1, size: "sm" } satisfies Partial<typeof _props>,
        _props
    );
    const [local, others] = splitProps(props, [
        "total",
        "value",
        "setValue",
        "children",
        "class",
        "siblings",
        "boundaries",
        "size",
    ]);

    const range = (count: number, start: number) =>
        new Array(count).fill(0).map((_, i) => i + start);

    const boundaryCount = () => local.boundaries * 2;
    const siblingCount = () => local.siblings * 2;
    const pageCount = () => boundaryCount() + siblingCount() + 3;

    const each = (): Range => {
        if (local.total <= pageCount()) return range(local.total, 0);

        const bc = boundaryCount();
        const sc = siblingCount();

        const margin = bc + sc;

        const showLeft = local.value < margin - local.siblings;
        const showRight = local.value >= local.total - margin + local.siblings;

        const leftBoundary = range(local.boundaries, 0);
        const rightBoundary = range(local.boundaries, local.total - local.boundaries);

        // most left
        if (showLeft) {
            const count = margin + 1;
            const start = 0;
            return [...range(count, start), DOTS, ...rightBoundary];
        }

        // most right
        if (showRight) {
            const count = margin + 1;
            const start = local.total - count;
            return [...leftBoundary, DOTS, ...range(count, start)];
        }

        return [
            ...leftBoundary,
            DOTS,
            ...range(local.siblings, local.value - local.siblings),
            local.value,
            ...range(local.siblings, local.value + 1),
            DOTS,
            ...rightBoundary,
        ];
    };

    const clamp = (value: number): number => {
        const a = 0;
        const b = local.total - 1;

        if (b <= 0) return 0;
        if (value <= a) return a;
        if (value >= b) return b;

        return value;
    };

    return (
        <Group class={pagination({ class: local.class })} {...others}>
            <PaginationButton
                color="dimmed"
                size={local.size}
                // eslint-disable-next-line solid/reactivity
                onClick={() => local.setValue(v => clamp(v - 1))}
            >
                <IconChevronLeft size={CHEVRON_SIZE} />
            </PaginationButton>

            <Index each={each()}>
                {value => (
                    <Show
                        when={value() !== DOTS}
                        fallback={
                            <PaginationButton
                                size={local.size}
                                class="outline-none border-none bg-transparent pointer-events-none"
                            >
                                <IconDots />
                            </PaginationButton>
                        }
                    >
                        <PaginationItem
                            page={value() as number}
                            setValue={local.setValue}
                            value={local.value}
                            size={local.size}
                        >
                            {(value() as number) + 1}
                        </PaginationItem>
                    </Show>
                )}
            </Index>

            <PaginationButton
                color="dimmed"
                size={local.size}
                // eslint-disable-next-line solid/reactivity
                onClick={() => local.setValue(v => clamp(v + 1))}
            >
                <IconChevronRight size={CHEVRON_SIZE} />
            </PaginationButton>
        </Group>
    );
}
