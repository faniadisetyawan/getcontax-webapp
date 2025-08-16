import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Student } from "@/types/students";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { PiSpeedometerDuotone } from "react-icons/pi";
import "react-datepicker/dist/react-datepicker.css";


interface Props {
    metaOptions: MetaOptions;
    old: Student | null;
}

export default function FormBuilder({ metaOptions, old }: Props) {
    const { data, setData, errors, post, processing, clearErrors } = useForm({
        name: '',
        reg_id: '',
        nisn: '',
        nis_nipd: '',
        gender: '',
        birth_place: '',
        birth_date: '',
    });

    useEffect(() => {
        if (!!old && old?.id) {
            setData(prev => ({
                ...prev,
                name: old.name || '',
                reg_id: old.reg_id || '',
                nisn: old.nisn || '',
                nis_nipd: old.nis_nipd || '',
                gender: old.gender || '',
                birth_place: old.birth_place || '',
                birth_date: old.birth_date || '',
            }));
        }
    }, [old]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('master.students.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('master.students.update', old?.id), {
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
                        title: 'Siswa',
                        url: route('master.students.index'),
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

                        <Container>
                <Form onSubmit={handleSubmit}>
                    {old && <input type="hidden" name="_method" value="PUT" />}
                    
                    <Card>
                        <Card.Header><Card.Title as="h5">Informasi Siswa</Card.Title></Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="name" className="required">Nama Lengkap</Form.Label>
                                        <Form.Control id="name" value={data.name} onChange={e => setData('name', e.target.value)} isInvalid={!!errors.name} />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="reg_id" className="required">REG ID</Form.Label>
                                        <Form.Control id="reg_id" value={data.reg_id} onChange={e => setData('reg_id', e.target.value)} isInvalid={!!errors.reg_id} />
                                        <Form.Control.Feedback type="invalid">{errors.reg_id}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="nisn">NISN</Form.Label>
                                        <Form.Control id="nisn" value={data.nisn} onChange={e => setData('nisn', e.target.value)} isInvalid={!!errors.nisn} />
                                        <Form.Control.Feedback type="invalid">{errors.nisn}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="nis_nipd">NIS_NIPD</Form.Label>
                                        <Form.Control id="nis_nipd" value={data.nis_nipd} onChange={e => setData('nis_nipd', e.target.value)} isInvalid={!!errors.nis_nipd} />
                                        <Form.Control.Feedback type="invalid">{errors.nis_nipd}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="gender">Jenis Kelamin</Form.Label>
                                    <Form.Select
                                        id="gender"
                                        value={data.gender}
                                        onChange={e => setData('gender', e.target.value)}
                                        isInvalid={!!errors.gender}
                                    >
                                        <option value="">-- Pilih Jenis Kelamin --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                                </Form.Group>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="birth_place" className="required">Tempat Lahir</Form.Label>
                                        <Form.Control id="birth_place" value={data.birth_place} onChange={e => setData('birth_place', e.target.value)} isInvalid={!!errors.birth_place} />
                                        <Form.Control.Feedback type="invalid">{errors.birth_place}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label htmlFor="birth_date">Tanggal Lahir</Form.Label>
                                <div>
                                    <ReactDatePicker
                                        id="birth_date"
                                        className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`}
                                        selected={data.birth_date ? new Date(data.birth_date) : null}
                                        onChange={(date: Date | null) => {
                                            const formattedDate = date ? date.toISOString().split('T')[0] : '';
                                            setData('birth_date', formattedDate);
                                        }}
                                        dateFormat="dd/MM/yyyy" 
                                        placeholderText="Pilih tanggal..."
                                    />
                                </div>
                                {errors.birth_date && <div className="text-danger small mt-1">{errors.birth_date}</div>}
                                </Form.Group>
                            
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="light" type="button" onClick={() => router.get(route('master.students.index'))}>Batal</Button>
                        <Button variant="primary" type="submit" disabled={processing}>
                            <span>{!old ? "Submit Data" : "Update Data"}</span>
                            {processing && <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
                        </Button>
                    </div>
                </Form>
            </Container>
        </AppLayout>
    )
}

