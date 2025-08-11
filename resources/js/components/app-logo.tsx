import { HTMLAttributes } from "react";
import { Image } from "react-bootstrap";

export default function AppLogo(props: HTMLAttributes<HTMLElement>) {
    return (
        <Image
            src="/storage/logo.png"
            {...props}
        />
    )
}
