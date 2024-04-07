import { MouseEventHandler } from "react";
import { ChildrenProps, ClassNameProps } from "@/types";

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement> &
        MouseEventHandler<HTMLAnchorElement>;
} & ChildrenProps &
    ClassNameProps;

export const Button = ({ onClick, className, children }: ButtonProps) => {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
};
