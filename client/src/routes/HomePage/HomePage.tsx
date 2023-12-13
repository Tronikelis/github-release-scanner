import React from "react";

import { useRepositories } from "~/hooks/swr/repository";

import RepositoryItem from "./RepositoryItem";

const HomePage = () => {
    const { data } = useRepositories();

    return (
        <div className="grid grid-cols-4 gap-8">
            {data?.Rows.map(item => (
                <RepositoryItem
                    key={item.ID}
                    releaseAssetCount={item.Releases[0]?.ReleaseAssets.length ?? 0}
                    isVtFinished={
                        item.Releases[0]?.ReleaseAssets.every(item => item.VtFinished) ?? false
                    }
                    totalPositives={
                        item.Releases[0]?.ReleaseAssets.reduce(
                            (prev, acc) => (acc.Positives ?? 0) + prev,
                            0
                        ) ?? 0
                    }
                    name={item.Name}
                    createdAt={item.CreatedAt}
                    description={item.Description || ""}
                    releaseName={item.Releases[0]?.Name || ""}
                    stars={item.Stars}
                />
            ))}
        </div>
    );
};

export default HomePage;
