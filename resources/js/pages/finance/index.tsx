import AppLayout from '@/layouts/app-layout';
import AppPageHeader from '@/layouts/app-page-header';
import { FlashProps, MetaOptions, MetaPagination } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AppPagination from '@/components/app-pagination'; // Asumsi Anda punya komponen ini
import { useQueryParams } from '@/hooks/use-query-params';
import { PiSpeedometerDuotone } from 'react-icons/pi';

// Tipe data untuk statistik
interface CanteenStats {
    total_sales: number;
    total_withdrawals: number;
    available_balance: number;
}

// Tipe data untuk satu baris riwayat penarikan
interface WithdrawalHistory {
    id: number;
    amount: number;
    withdrawal_date: string;
    notes: string | null;
    user: {
        name: string;
    };
}

// Tipe data untuk respons terpaginasi
interface PaginatedWithdrawals {
    data: WithdrawalHistory[];
    meta: MetaPagination;
}

// Tipe data lengkap untuk Props halaman ini
interface Props {
    metaOptions: MetaOptions;
    stats: CanteenStats;
    withdrawalHistories: PaginatedWithdrawals;
    flash: FlashProps;
}

export default function CanteenFinanceIndex({ metaOptions, stats, withdrawalHistories, flash }: Props) {
    const [params, setParams] = useQueryParams();

    // Menampilkan notifikasi dari server
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Mengelola state form penarikan
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        notes: '',
    });

    // Fungsi untuk submit form penarikan
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('finance.canteen.withdraw'), {
            onSuccess: () => reset(),
        });
    };

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
                        url: '/dashboard',
                    },
                    {
                        title: 'Kantin',
                        active: true,
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container fluid>
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Card body className="text-center h-100">
                            <Card.Subtitle className="text-muted mb-2">Total Pendapatan Kotor</Card.Subtitle>
                            <Card.Title as="h2" className="fw-bold">
                                Rp {stats.total_sales.toLocaleString('id-ID')}
                            </Card.Title>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card body className="text-center h-100">
                            <Card.Subtitle className="text-muted mb-2">Total Dana Ditarik</Card.Subtitle>
                            <Card.Title as="h2" className="fw-bold">
                                Rp {stats.total_withdrawals.toLocaleString('id-ID')}
                            </Card.Title>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card body className="text-center bg-success-subtle text-success-emphasis h-100">
                            <Card.Subtitle className="mb-2">Saldo Tersedia untuk Penarikan</Card.Subtitle>
                            <Card.Title as="h2" className="fw-bold">
                                Rp {stats.available_balance.toLocaleString('id-ID')}
                            </Card.Title>
                        </Card>
                    </Col>
                </Row>

                <Card body className="mb-4">
                    <Card.Title as="h5">Lakukan Penarikan Dana</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="amount" className="required">Jumlah Penarikan</Form.Label>
                                    <Form.Control
                                        id="amount"
                                        type="number"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        max={stats.available_balance}
                                        placeholder="Maks. Rp..."
                                        isInvalid={!!errors.amount}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="notes">Catatan (Opsional)</Form.Label>
                                    <Form.Control
                                        id="notes"
                                        as="textarea"
                                        rows={1}
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        isInvalid={!!errors.notes}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.notes}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" disabled={processing || stats.available_balance <= 0}>
                            {processing ? 'Memproses...' : 'Catat Penarikan'}
                        </Button>
                    </Form>
                </Card>

                <h5 className="mt-5">Riwayat Penarikan</h5>
                <Table striped bordered hover responsive>
                    <thead className="table-light">
                        <tr>
                            <th>Tanggal Penarikan</th>
                            <th className="text-end">Jumlah</th>
                            <th>Dicatat Oleh</th>
                            <th>Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawalHistories.data.length > 0 ? (
                            withdrawalHistories.data.map(history => (
                                <tr key={history.id}>
                                    <td>{new Date(history.withdrawal_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td className="text-end">Rp {history.amount.toLocaleString('id-ID')}</td>
                                    <td>{history.user.name}</td>
                                    <td>{history.notes || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-muted">Belum ada riwayat penarikan.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <AppPagination meta={withdrawalHistories.meta} onPageChange={(page) => setParams({ page })} />

            </Container>
        </AppLayout>
    );
}