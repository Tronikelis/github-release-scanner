import { Card, CardBody } from "@nextui-org/react";
import React from "react";

import Group from "~/components/Group/Group";
import Stack from "~/components/Stack";
import Text from "~/components/Text";

type Props = {
    name: string;
    description: string;
    releaseName: string;
    stars: number;
    createdAt: string;
    totalPositives: number;
    isVtFinished: boolean;
    releaseAssetCount: number;
};

const RepositoryItem = ({
    createdAt,
    description,
    isVtFinished,
    name,
    releaseAssetCount,
    releaseName,
    stars,
    totalPositives,
}: Props) => {
    const renderStatus = () => {
        if (releaseAssetCount === 0) return "😶";
        if (totalPositives > 0) return "❌";
        if (isVtFinished && totalPositives === 0) return "✅";
        return "⏳";
    };

    return (
        <Card>
            <CardBody>
                <Stack className="gap-2">
                    <Text>{name}</Text>

                    <Group className="gap-2">
                        <Text size="large">{renderStatus()}</Text>
                        <Text size="large">{releaseName}</Text>
                    </Group>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default RepositoryItem;
