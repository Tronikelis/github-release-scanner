import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import urlbat from "urlbat";

import Group from "~/components/Group/Group";
import { getApiBaseUrl } from "~/utils";

const AddRepository = () => {
    const [repoName, setRepoName] = useState("");

    const add = useSWRMutation("_", () =>
        fetch(urlbat(getApiBaseUrl(), "/repository/add"), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: repoName,
            }),
        })
    );

    return (
        <Group className="justify-between">
            <Input type="text" value={repoName} onChange={e => setRepoName(e.target.value)} />

            <Button isLoading={add.isMutating} onClick={() => add.trigger()}>
                Add
            </Button>
        </Group>
    );
};

export default AddRepository;
