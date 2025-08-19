import UploadImage from "@/components/upload-image";
import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { School } from "@/types/school";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PiSpeedometerDuotone } from "react-icons/pi";

interface Props {
    metaOptions: MetaOptions;
    old: School | null;
}

export default function FormBuilder({ metaOptions, old }: Props) {
    const { data, setData, errors, post, processing, clearErrors } = useForm({
        npsn: '',
        name: '',
        address: '',
        phone: '',
        logo: null as File | null,
        checkin_start_time: '',
        checkin_end_time: '',
        checkout_start_time: '',
        checkout_end_time: '',
    });

    useEffect(() => {
        if (!!old && old?.id) {
            const formatTime = (time: string | null) => {
                if (!time) return '';
                // If time is already in HH:mm format, return as is
                if (time.match(/^\d{2}:\d{2}$/)) return time;
                // Otherwise try to format it
                try {
                    return new Date(time).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch {
                    return '';
                }
            };
            setData(prev => ({
                ...prev,
                npsn: old?.npsn ?? '',
                name: old?.name ?? '',
                address: old?.address ?? '',
                phone: old?.phone ?? '',
                checkin_start_time: formatTime(old?.checkin_start_time),
                checkin_end_time: formatTime(old?.checkin_end_time),
                checkout_start_time: formatTime(old?.checkout_start_time),
                checkout_end_time: formatTime(old?.checkout_end_time),
            }));
        }
    }, [old]);

    const handleLogoChange = (file: File | null) => {
        setData('logo', file);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('master.schools.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('master.schools.update', old?.id), {
                forceFormData: true,
            });
        }
    }

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
                        title: 'Master',
                        active: true,
                    },
                    {
                        title: 'Sekolah',
                        url: route('master.schools.index'),
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container className="p-0">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="name" className="required">Nama Sekolah</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label htmlFor="npsn">NPSN</Form.Label>
                                        <Form.Control
                                            name="npsn"
                                            value={data.npsn}
                                            onChange={(e) => setData('npsn', e.target.value)}
                                            isInvalid={!!errors.npsn}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.npsn}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label htmlFor="phone">Nomor Telp</Form.Label>
                                        <Form.Control
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            isInvalid={!!errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="address">Alamat Sekolah</Form.Label>
                                <Form.Control
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Check-in Time Range</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="time"
                                            name="checkin_start_time"
                                            value={data.checkin_start_time}
                                            onChange={(e) => setData('checkin_start_time', e.target.value)}
                                            isInvalid={!!errors.checkin_start_time}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.checkin_start_time}</Form.Control.Feedback>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="time"
                                            name="checkin_end_time"
                                            value={data.checkin_end_time}
                                            onChange={(e) => setData('checkin_end_time', e.target.value)}
                                            isInvalid={!!errors.checkin_end_time}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.checkin_end_time}</Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group><Form.Group className="mb-4">
                                <Form.Label>Check-out Time Range</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="time"
                                            name="checkout_start_time"
                                            value={data.checkout_start_time}
                                            onChange={(e) => setData('checkout_start_time', e.target.value)}
                                            isInvalid={!!errors.checkout_start_time}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.checkout_start_time}</Form.Control.Feedback>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="time"
                                            name="checkout_end_time"
                                            value={data.checkout_end_time}
                                            onChange={(e) => setData('checkout_end_time', e.target.value)}
                                            isInvalid={!!errors.checkout_end_time}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.checkout_end_time}</Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <CardSection>
                                <h5 className="mb-3">Logo</h5>
                                <div className="text-center">
                                    <UploadImage
                                        initialImage={old?.logo_url}
                                        selectedImage={data.logo}
                                        onFileChange={handleLogoChange}
                                    />
                                    {errors.logo && (
                                        <Form.Text className="text-danger">{errors.logo}</Form.Text>
                                    )}
                                    <div className="small text-muted">Only *.png, *.jpg and *.jpeg image files are accepted</div>
                                </div>
                            </CardSection>
                        </Col>
                    </Row>
                    <hr className="border-dashed" />
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                        <Button type="button" variant="light" onClick={() => router.visit(route('master.schools.index'))}>Cancel</Button>
                        <Button type="submit" variant="primary" className="btn-icon-label" disabled={processing}>
                            <span>{!old ? "Submit Data" : "Update Data"}</span>
                            {processing && <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
                        </Button>
                    </div>
                </Form>
            </Container>
        </AppLayout>
    )
}

const CardSection = ({ children }: { children: ReactNode }) => {
    return (
        <Card body className="py-3 px-md-2">
            {children}
        </Card>
    )
}
