import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

const Container = ({ children }: Props) => {
    return (
        <div className="w-full flex items-center justify-center my-12 px-4">
            <div className="container">{children}</div>
        </div>
    );
};

export default Container;
