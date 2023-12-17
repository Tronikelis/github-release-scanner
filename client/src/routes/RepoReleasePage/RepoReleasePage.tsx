import { useParams } from "@solidjs/router";

import Paper from "~/components/Paper";

export default function RepoReleasePage() {
    const { repoName, releaseId } = useParams();

    return (
        <Paper>
            {releaseId} {repoName}
        </Paper>
    );
}
