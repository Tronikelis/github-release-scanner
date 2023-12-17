import { ComponentProps } from "solid-js";

import Button from "~/components/Button";

type Props = ComponentProps<typeof Button>;

export default function PaginationButton(props: Props) {
    return <Button isSquare {...props} />;
}
