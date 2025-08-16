import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import { Button, Card, Form, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function StudentImportPage() {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null as File | null,
    });

    const { flash } = usePage<{ flash: FlashProps }>().props;

    // useEffect untuk memantau flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('master.students.import'));
    };

    return (
        <AppLayout>
            <Head title="Impor Data Siswa" />
            <Card>
                <Card.Header>
                    <Card.Title as="h5">Upload File Excel Siswa</Card.Title>
                </Card.Header>
                <Card.Body>
                    <p>
                        Silakan upload file Excel (.xlsx, .xls) atau CSV (.csv) yang berisi data siswa.
                        Pastikan file Anda memiliki kolom header: <strong>nisn, nama, jenis_kelamin, tempat_lahir, tanggal_lahir, tahun_masuk</strong>.
                    </p>
                        <a href={route('master.students.template.download')}>Download Template Excel di Sini</a>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="file" className="required">Pilih File</Form.Label>
                            <Form.Control
                                id="file"
                                type="file"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('file', e.target.files ? e.target.files[0] : null)}
                                isInvalid={!!errors.file}
                            />
                            <Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
                        </Form.Group>

                        {processing && (
                            <ProgressBar 
                                animated 
                                now={progress?.percentage} 
                                label={`${progress?.percentage}%`} 
                                className="mb-3"
                            />
                        )}

                        <Button type="submit" variant="primary" disabled={processing}>
                            {processing ? 'Mengimpor...' : 'Mulai Impor'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </AppLayout>
    );
}