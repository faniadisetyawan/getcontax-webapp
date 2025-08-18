import AppLayout from "@/layouts/app-layout";
import { MetaOptions, SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { PiUserCircleDuotone } from "react-icons/pi";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Definisikan tipe data untuk props
interface ProductOrderData {
    name: string;
    y: number;
}

interface AttendanceData {
    name: string;
    y: number;
    color: string;
}

interface FinancialHistoryData {
    categories: string[];
    series: {
        name: string;
        data: number[];
    }[];
}

interface Props {
    metaOptions: MetaOptions;
    totalStudents: number;
    totalSchools: number;
    totalRevenue: number;
    productOrderData: ProductOrderData[];
    attendanceData: AttendanceData[];
    financialHistoryData: FinancialHistoryData;
}

export default function Dashboard({
    metaOptions,
    totalStudents,
    totalSchools,
    totalRevenue,
    productOrderData,
    attendanceData,
    financialHistoryData,
}: Props) {
    const { auth } = usePage<SharedData>().props;

    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Opsi untuk diagram batang (Bar Chart)
    const productOrderOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Jumlah Item per Pesanan'
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Pesanan'
            }
        },
        yAxis: {
            title: {
                text: 'Jumlah Item'
            }
        },
        series: [{
            name: 'Jumlah Item',
            data: productOrderData
        }],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    };

    // Opsi untuk diagram lingkaran (Pie Chart)
    const attendanceOptions = {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Persentase Status Kehadiran'
        },
        series: [{
            name: 'Status',
            data: attendanceData,
            innerSize: '60%', // Membuat donut chart
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }],
        credits: {
            enabled: false
        }
    };

    // Opsi untuk diagram garis (Line Chart)
    const financialHistoryOptions = {
        title: {
            text: 'Riwayat Saldo Siswa'
        },
        xAxis: {
            categories: financialHistoryData.categories,
            title: {
                text: 'Waktu'
            }
        },
        yAxis: {
            title: {
                text: 'Saldo (Rp)'
            }
        },
        series: financialHistoryData.series,
        credits: {
            enabled: false
        }
    };

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

                <Row className="mb-4 g-4">
                    <Col md={4}>
                        <Card className="text-center text-white rounded-3 shadow-sm" style={{ backgroundColor: '#0d6efd' }}>
                            <Card.Body>
                                <h5 className="card-title">Total Siswa</h5>
                                <h1 className="card-text fw-bold fs-1">{totalStudents}</h1>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center text-white rounded-3 shadow-sm" style={{ backgroundColor: '#198754' }}>
                            <Card.Body>
                                <h5 className="card-title">Total Sekolah</h5>
                                <h1 className="card-text fw-bold fs-1">{totalSchools}</h1>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center text-dark rounded-3 shadow-sm" style={{ backgroundColor: '#ffc107' }}>
                            <Card.Body>
                                <h5 className="card-title">Total Pendapatan Kantin</h5>
                                <h1 className="card-text fw-bold fs-1">{formatRupiah(totalRevenue)}</h1>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={attendanceOptions}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={productOrderOptions}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={financialHistoryOptions}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </AppLayout>
    );
}
