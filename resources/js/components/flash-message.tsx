import { useEffect } from "react";
import { toast } from "react-toastify";

interface FlashMessageProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

export default function FlashMessage({ type, message }: FlashMessageProps) {
    useEffect(() => {
        if (message) toast[type](message);
    }, [type, message]);

    return null;
}
