import { createEventListener } from "@solid-primitives/event-listener";

type CanMany<T> = T | T[];

export default function useClickOutside(
    target: (() => CanMany<HTMLElement | undefined>) | CanMany<HTMLElement>,
    cb: (event: MouseEvent) => void
) {
    function isInside(x: number, y: number, target: HTMLElement) {
        const rects = target.getBoundingClientRect();

        return (
            // deltaX
            rects.left <= x &&
            rects.right >= x &&
            // deltaY
            rects.top <= y &&
            rects.bottom >= y
        );
    }

    createEventListener(document, "click", (event: MouseEvent) => {
        let el: CanMany<HTMLElement | undefined>;

        if (typeof target === "function") {
            el = target();
        } else {
            el = target;
        }

        if (el === undefined) {
            console.warn("[useClickOutside]: el was undefined, returning");
            return;
        }

        if (Array.isArray(el) && el.includes(undefined)) {
            console.warn("[useClickOutside]: el was undefined, returning");
            return;
        }

        const x = event.clientX;
        const y = event.clientY;

        const inside = Array.isArray(el)
            ? el.some(t => isInside(x, y, t as HTMLElement))
            : isInside(x, y, el);

        if (!inside) cb(event);
    });
}
