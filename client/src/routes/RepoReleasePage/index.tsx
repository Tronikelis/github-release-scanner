import Paper from "~/components/Paper";
import Text from "~/components/Text";
import useDecodedParams from "~/hooks/useDecodedParams";

export default function RepoReleasePage() {
    const params = useDecodedParams();

    const repoName = () => params().repoName;
    const releaseId = () => params().releaseId;

    return (
        <Paper>
            <Text>
                TODO release page, you can checkout the repo page as it's kinda finished
            </Text>

            <Text>
                Url params: {releaseId()} {repoName()}
            </Text>
        </Paper>
    );
}
