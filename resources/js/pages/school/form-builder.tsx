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
    });

    useEffect(() => {
        if (!!old && old?.id) {
            setData(prev => ({
                ...prev,
                npsn: old?.npsn ?? '',
                name: old?.name ?? '',
                address: old?.address ?? '',
                phone: old?.phone ?? '',
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
