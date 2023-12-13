import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

import { useRepositories } from "~/hooks/swr/repository";

const HomePage = () => {
    const { data } = useRepositories();

    return (
        <div className="grid grid-cols-4 gap-8">
            {data?.Rows.map(item => (
                <Card key={item.ID}>
                    <CardHeader>{item.Name}</CardHeader>
                    <CardBody>{item.Releases[0]?.Name}</CardBody>
                </Card>
            ))}
        </div>
    );
};

export default HomePage;
