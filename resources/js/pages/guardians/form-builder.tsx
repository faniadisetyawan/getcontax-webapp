import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Student } from "@/types/students";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect, useMemo } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { PiSpeedometerDuotone } from "react-icons/pi";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'
import { Guardian } from "@/types/guardians";

interface StudentOption {
    value: number;
    label: string;
}

interface Props {
    metaOptions: MetaOptions;
    students: Student;
    old: Guardian | null;
}

export default function FormBuilder({ metaOptions, students, old }: Props) {
    const { data, setData, errors, post, processing, clearErrors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        student_ids: [] as number[],
    });

    const studentOptions = useMemo<StudentOption[]>(() => 
        students.map(s => ({ value: s.id, label: `${s.name} (${s.reg_id})` })),
        [students]
    );

    useEffect(() => {
        if (!!old && old?.id) {
            setData(prev => ({
                ...prev, 
                name: old.name || '',
                email: old.email || '',
                password: '',
                password_confirmation: '',
                student_ids: old.children?.map(c => c.id) || [],
            }));
        }
    }, [old]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('master.guardians.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('master.guardians.update', old?.id), {
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
                        title: 'Wali Murid',
                        url: route('master.guardians.index'),
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="name" className="required">Nama Wali Murid</Form.Label>
                                        <Form.Control id="name" value={data.name} onChange={e => setData('name', e.target.value)} isInvalid={!!errors.name} />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="email" className="required">Email</Form.Label>
                                        <Form.Control id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} isInvalid={!!errors.email} />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="password" className={!old ? 'required' : ''}>Password</Form.Label>
                                        <Form.Control id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} isInvalid={!!errors.password} />
                                        {old && <Form.Text className="text-muted">Kosongkan jika tidak ingin mengubah password.</Form.Text>}
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="password_confirmation" className={!old ? 'required' : ''}>Konfirmasi Password</Form.Label>
                                        <Form.Control id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="students" className="required">Hubungkan ke Siswa</Form.Label>
                                <Select
                                    isMulti
                                    options={studentOptions}
                                    value={studentOptions.filter(option => data.student_ids.includes(option.value))}
                                    onChange={selected => setData('student_ids', selected.map(s => s.value))}
                                    placeholder="Cari nama atau REG ID siswa..."
                                    classNamePrefix="select"
                                />
                                {errors.student_ids && <div className="text-danger small mt-1">{errors.student_ids}</div>}
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-end mt-4">
                        <Button type="submit" variant="primary" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Wali Murid'}
                        </Button>
                    </div>
                </Form>
            </Container>
        </AppLayout>
    )
}

