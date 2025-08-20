import UploadImage from "@/components/upload-image";
import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Product } from "@/types/products";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PiSpeedometerDuotone } from "react-icons/pi";

interface SchoolClass {
    id: number;
    name: string;
    level: string;
    homeroom_teacher_id: number | null;
}

interface Teacher {
    id: number;
    name: string;
}

interface Props {
    metaOptions: MetaOptions;
    old: SchoolClass | null;
    teachers: Teacher[]; 
}

export default function FormBuilder({ metaOptions, old, teachers }: Props) {
    const { data, setData, errors, post, processing, clearErrors } = useForm({
        name: '',
        level: '',
        homeroom_teacher_id: '',
    });

    useEffect(() => {
        if (!!old && old?.id) {
            setData(prev => ({
                ...prev,
                name: old.name || '',
                level: old.level || '',
                homeroom_teacher_id: old.homeroom_teacher_id?.toString() || '',
            }));
        }
    }, [old]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('master.classes.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('master.classes.update', old?.id), {
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
                        title: 'Kelas',
                        url: route('master.classes.index'),
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container className="p-0">
                <Form onSubmit={handleSubmit}>
                    <Card>
                        <Card.Header><Card.Title as="h5">Informasi Kelas</Card.Title></Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="name" className="required">Nama Kelas</Form.Label>
                                        <Form.Control id="name" value={data.name} onChange={e => setData('name', e.target.value)} isInvalid={!!errors.name} placeholder="Contoh: 10-A, 11 IPA 1" />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="level">Tingkat</Form.Label>
                                        <Form.Control id="level" value={data.level} onChange={e => setData('level', e.target.value)} isInvalid={!!errors.level} placeholder="Contoh: 10, 11, 12" />
                                        <Form.Control.Feedback type="invalid">{errors.level}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="homeroom_teacher_id">Wali Kelas</Form.Label>
                                        <Form.Select id="homeroom_teacher_id" value={data.homeroom_teacher_id} onChange={e => setData('homeroom_teacher_id', e.target.value)} isInvalid={!!errors.homeroom_teacher_id}>
                                            <option value="">-- Tidak Ada --</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errors.homeroom_teacher_id}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <hr className="border-dashed" />
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                        <Button type="button" variant="light" onClick={() => router.visit(route('master.classes.index'))}>Cancel</Button>
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

