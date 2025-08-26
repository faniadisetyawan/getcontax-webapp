import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Status } from "@/types/status";
import { Head } from "@inertiajs/react";
import { Container, Table } from "react-bootstrap";
import { PiSpeedometerDuotone } from "react-icons/pi";

interface Props {
    metaOptions: MetaOptions;
    data: Status[];
}

export default function IndexPage({ metaOptions, data }: Props) {
    return (
        <AppLayout>
            <Head title={metaOptions.title} />

            <AppPageHeader
                title={metaOptions.title}
                description={metaOptions.description}
                breadcrumb={[
                    {
                        title: (
                            <div className="d-flex align-items-center gap-1">
                                <PiSpeedometerDuotone className="mb-0 fs-5 text-primary" />
                            </div>
                        ),
                        url: route('dashboard'),
                    },
                    {
                        title: 'Master',
                        active: true,
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container className="p-0">
                <Table responsive hover className="table-theme">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((status, i) => (
                            <tr key={i}>
                                <td>{status.id}</td>
                                <td>{status.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </AppLayout>
    )
}
