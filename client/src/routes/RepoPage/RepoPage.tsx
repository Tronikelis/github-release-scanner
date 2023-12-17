import { useParams } from "@solidjs/router";

import Paper from "~/components/Paper";

export default function RepoPage() {
    const { repoName } = useParams();

    return <Paper>{repoName}</Paper>;
}
