import React from "react";

export const Center = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex justify-center items-center h-full -mt-20">
            {children}
        </div>
    );
};
