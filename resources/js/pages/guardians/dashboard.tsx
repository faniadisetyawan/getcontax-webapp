import AppLayout from "@/layouts/app-layout";
import { MetaOptions, SharedData, type BreadcrumbItem } from "@/types";
import { Student } from "@/types/students";
import { Head, usePage } from "@inertiajs/react";
import { Container, Image, Card, Col, Row, Badge, Table, Tabs, Tab } from "react-bootstrap";
import { PiUserCircleDuotone } from "react-icons/pi";



interface Attendance {
    id: number;
    date: string;
    time_in: string | null;
    status: string | null;
}

interface FinancialHistory {
    id: number;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    created_at: string;
}

interface StudentWithDetails extends Student {
    attendances: Attendance[];
    financialHistories: FinancialHistory[];
}

interface Props {
    metaOptions: MetaOptions;
    childrenData: StudentWithDetails[];
}

export default function Dashboard({ metaOptions, childrenData }: Props) {
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

                <Row>
                    {childrenData.map(child => (
                        <Col md={12} key={child.id} className="mb-4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title as="h5" className="mb-0">{child.name}</Card.Title>
                                        <Card.Subtitle className="text-muted mt-1">REG ID: {child.reg_id}</Card.Subtitle>
                                    </div>
                                    <Badge bg="success" style={{ fontSize: '1rem' }}>
                                        Saldo: Rp {child.balance.toLocaleString('id-ID')}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <Tabs defaultActiveKey="attendance" id={`tab-${child.id}`} className="mb-3">
                                        {/* TAB UNTUK RIWAYAT ABSENSI */}
                                        <Tab eventKey="attendance" title="Riwayat Absensi (5 Terakhir)">
                                            <Table striped responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Tanggal</th>
                                                        <th>Jam Masuk</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {child.attendances.map(att => (
                                                        <tr key={att.id}>
                                                            <td>{new Date(att.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</td>
                                                            <td>{att.time_in || '-'}</td>
                                                            <td>
                                                                <Badge bg={att.status === 'Tepat Waktu' ? 'success' : 'warning'}>
                                                                    {att.status || 'N/A'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Tab>

                                        {/* TAB UNTUK RIWAYAT KEUANGAN */}
                                        <Tab eventKey="financial" title="Riwayat Keuangan (5 Terakhir)">
                                            <Table striped responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Tanggal</th>
                                                        <th>Deskripsi</th>
                                                        <th className="text-end">Jumlah</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {child.financialHistories.map(fin => (
                                                        <tr key={fin.id}>
                                                            <td>{new Date(fin.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</td>
                                                            <td>{fin.description}</td>
                                                            <td className={`text-end fw-bold ${fin.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                                                {fin.type === 'credit' ? '+' : '-'} Rp {fin.amount.toLocaleString('id-ID')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                
            </Container>
        </AppLayout>
    );
}
