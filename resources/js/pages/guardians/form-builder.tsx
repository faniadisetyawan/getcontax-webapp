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
import Select, { OnChangeValue } from 'react-select'
import { Guardian } from "@/types/guardians";
import TextareaAutosize from 'react-textarea-autosize';


interface StudentOption {
    value: number;
    label: string;
}

interface RelationState {
    student_id: number;
    relationship_type: string;
}

interface GuardianWithChildren extends Guardian {
    children: (Student & { pivot: { relationship_type: string } })[];
}

interface Props {
    metaOptions: MetaOptions;
    students: { id: number, name: string, reg_id: string }[]; 
    old: GuardianWithChildren  | null;
}

export default function FormBuilder({ metaOptions, students, old }: Props) {
    const { data, setData, errors, post, processing, clearErrors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        relations: [] as RelationState[],
    });

    const studentOptions = useMemo<StudentOption[]>(() => 
        students.map(s => ({ value: s.id, label: `${s.name} (${s.reg_id})` })),
        [students]
    );

    useEffect(() => {
        if (old) { 
            setData({
                name: old.name || '',
                email: old.email || '',
                phone_number: old.phone_number || '',
                address: old.address || '',
                password: '',
                password_confirmation: '',
                relations: old.children?.map(c => ({ 
                    student_id: c.id, 
                    relationship_type: (c.pivot?.relationship_type || '')
                })) || [],
            });
        }
    }, [old]); 

    const handleRelationTypeChange = (studentId: number, value: string) => {
        setData('relations', data.relations.map(rel => 
            rel.student_id === studentId ? { ...rel, relationship_type: value } : rel
        ));
    };

    const handleStudentSelect = (selected: OnChangeValue<StudentOption, true>) => {
        setData('relations', selected.map(s => {
            // Cek apakah siswa ini sudah ada di state sebelumnya untuk menjaga relationship_type
            const existing = data.relations.find(r => r.student_id === s.value);
            return {
                student_id: s.value,
                relationship_type: existing ? existing.relationship_type : ''
            };
        }));
    };

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
                                        <Form.Label htmlFor="phone_number" className="required">Nomor Telepon</Form.Label>
                                        <Form.Control id="phone_number" type="phone_number" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} isInvalid={!!errors.phone_number} />
                                        <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="address" className="required">Alamat</Form.Label>
                                    <Form.Control
                                    as={TextareaAutosize}
                                    id="address"
                                    minRows={3}
                                    maxRows={8}
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                    </Form.Control.Feedback>
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
                                    value={studentOptions.filter(option => data.relations.some(r => r.student_id === option.value))}
                                    onChange={handleStudentSelect}
                                    placeholder="Cari nama atau REG ID siswa..."
                                    classNamePrefix="select"
                                />
                                {errors.relations && <div className="text-danger small mt-1">{errors.relations}</div>}
                            </Form.Group>

                            {data.relations.length > 0 && (
                                <div className="mt-3 p-3 border rounded">
                                    <h6>Detail Relasi</h6>
                                    {data.relations.map((relation) => {
                                        const student = students.find(s => s.id === relation.student_id);
                                        return (
                                            <Row key={relation.student_id} className="align-items-center mb-2">
                                                <Col md={6}>{student?.name} ({student?.reg_id})</Col>
                                                <Col md={6}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Contoh: Ayah, Ibu, Wali..."
                                                        value={relation.relationship_type}
                                                        onChange={e => handleRelationTypeChange(relation.student_id, e.target.value)}
                                                    />
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                </div>
                            )}
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

