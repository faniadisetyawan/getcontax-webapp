import SelectStatus from "@/components/selects/select-status";
import UploadImage from "@/components/upload-image";
import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Contact } from "@/types/contact";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PiSpeedometerDuotone } from "react-icons/pi";

interface Props {
    metaOptions: MetaOptions;
    old: Contact | null;
}

export default function FormBuilder({ metaOptions, old }: Props) {
    const { data, setData, errors, post, put, processing } = useForm({
        phone_number: '',
        name: '',
        avatar: null as File | null,
        status_id: 1,
    });

    useEffect(() => {
        if (!!old) {
            setData(prev => ({
                ...prev,
                phone_number: old.phone_number,
                name: old.name,
                status_id: old.status_id,
            }));
        }
    }, [old]);

    const handleAvatarChange = (file: File | null) => {
        setData('avatar', file);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('contacts.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('contacts.update', old?.id), {
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
                        url: route('dashboard'),
                    },
                    {
                        title: 'Contacts',
                        url: route('contacts.index'),
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
                                <Form.Label htmlFor="phone_number" className="required">Phone Number</Form.Label>
                                <Form.Control
                                    id="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    isInvalid={!!errors.phone_number}
                                />
                                <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="name" className="required">Fullname</Form.Label>
                                <Form.Control
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="name" className="required">Set Status</Form.Label>
                                <SelectStatus
                                    value={data.status_id}
                                    onChange={(item) => setData('status_id', item.id)}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <CardSection>
                                <h5 className="mb-3">Avatar</h5>
                                <div className="text-center">
                                    <UploadImage
                                        initialImage={old?.avatar_url}
                                        selectedImage={data.avatar}
                                        onFileChange={handleAvatarChange}
                                    />
                                    {errors.avatar && (
                                        <Form.Text className="text-danger">{errors.avatar}</Form.Text>
                                    )}
                                    <div className="small text-muted">Only *.png, *.jpg and *.jpeg image files are accepted</div>
                                </div>
                            </CardSection>
                        </Col>
                    </Row>

                    <hr className="border-dashed" />
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                        <Button type="button" variant="light" onClick={() => router.visit(route('contacts.index'))}>Cancel</Button>
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
