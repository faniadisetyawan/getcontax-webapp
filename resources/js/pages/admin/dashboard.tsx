import AppLayout from "@/layouts/app-layout";
import { MetaOptions, SharedData, type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Container, Image } from "react-bootstrap";
import { PiUserCircleDuotone } from "react-icons/pi";

interface Props {
    metaOptions: MetaOptions;
}

export default function Dashboard({ metaOptions }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title={metaOptions.title} />

            <Container className="p-0">
                <div className="mb-4 d-flex gap-3">
                    <div className="flex-shrink-0">
                        {!auth.user.avatar ?
                            <PiUserCircleDuotone className="display-4 text-primary opacity-50" />
                            :
                            <Image
                                src={auth.user.avatar}
                                className="rounded-circle object-fit-cover"
                                style={{ width: 56, height: 56 }}
                            />
                        }
                    </div>
                    <div className="flex-grow-1">
                        <small className="d-block text-muted">Glad to see you,</small>
                        <h3 className="fw-bold">{auth.user.name}</h3>
                    </div>
                </div>
            </Container>
        </AppLayout>
    );
}
