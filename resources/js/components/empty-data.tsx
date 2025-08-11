import Lottie from "lottie-react";
import emptyAnimation from "../../../public/assets/lottie-empty.json";

export default function EmptyData() {
    return (
        <div className="py-5 px-3 d-flex align-items-center justify-content-center">
            <Lottie animationData={emptyAnimation} style={{ width: 200 }} />
        </div>
    )
}
