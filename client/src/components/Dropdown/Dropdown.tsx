import {
    autoUpdate,
    computePosition,
    flip,
    Middleware,
    offset,
    Placement,
    shift,
    size,
} from "@floating-ui/dom";
import { createEventListener } from "@solid-primitives/event-listener";
import { mergeRefs } from "@solid-primitives/refs";
import clsx from "clsx";
import {
    Accessor,
    ComponentProps,
    createEffect,
    createSignal,
    FlowComponent,
    onCleanup,
    splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { tv, VariantProps } from "tailwind-variants";

import useClickOutside from "~/hooks/useClickOutside";

const dropdown = tv({
    base: "inset-0 absolute w-max h-max",
});

type Props = {
    targetRef: Accessor<HTMLElement | undefined>;
    isHoverable?: boolean;
    isOpened?: boolean;
    isFullWidth?: boolean;
    placement?: Placement;
} & ComponentProps<"div"> &
    VariantProps<typeof dropdown>;

const Dropdown: FlowComponent<Props> = props => {
    const [local, others] = splitProps(props, [
        "targetRef",
        "isOpened",
        "class",
        "children",
        "ref",
        "isHoverable",
        "isFullWidth",
        "placement",
    ]);

    let dropdownRef: HTMLDivElement | undefined;

    const [isOpened, setIsOpened] = createSignal(false);

    const handleOpen = () => setIsOpened(true);
    const handleClose = () => setIsOpened(false);
    const handleToggle = () => setIsOpened(x => !x);

    // all the computing shits here
    createEffect(() => {
        if (!isOpened()) return;

        const middleware: Middleware[] = [offset(6), flip(), shift()];

        if (local.isFullWidth) {
            middleware.push(
                size({
                    apply: ({ rects }) => {
                        dropdownRef!.style.width = `${rects.reference.width}px`;
                    },
                })
            );
        }

        const compute = async () => {
            const { x, y } = await computePosition(local.targetRef()!, dropdownRef!, {
                placement: local.placement,
                middleware,
            });

            dropdownRef!.style.left = `${x}px`;
            dropdownRef!.style.top = `${y}px`;
        };

        const cleanup = autoUpdate(local.targetRef()!, dropdownRef!, compute);
        onCleanup(cleanup);
    });

    // controlled stuff
    createEffect(() => {
        if (local.isOpened === undefined) return;
        setIsOpened(local.isOpened);
    });

    // uncontrolled
    createEffect(() => {
        if (local.isOpened !== undefined) return;

        createEventListener(local.targetRef, "click", handleToggle);
        useClickOutside(() => [local.targetRef(), dropdownRef], handleClose);

        if (local.isHoverable) {
            createEventListener(local.targetRef, "mouseenter", handleOpen);
            createEventListener(local.targetRef, "mouseleave", handleClose);
        }
    });

    return (
        <Portal>
            <div
                ref={mergeRefs(local.ref, el => (dropdownRef = el))}
                class={clsx(dropdown({ class: local.class }), {
                    invisible: !isOpened(),
                    visible: isOpened(),
                })}
                {...others}
            >
                {local.children}
            </div>
        </Portal>
    );
};

export default Dropdown;
