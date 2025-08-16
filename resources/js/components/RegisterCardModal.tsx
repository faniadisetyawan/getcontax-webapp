import { Student } from "@/types/students";
import { useForm } from "@inertiajs/react";
import { FormEvent, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface Props {
    show: boolean;
    onHide: () => void;
    student: Student | null;
}

export default function RegisterCardModal({ show, onHide, student }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rfid_uid: '',
        va_number: '',
    });

    // Isi form saat modal dibuka dengan data siswa yang dipilih
    useEffect(() => {
        if (student) {
            setData({
                rfid_uid: student.rfid_uid || '',
                va_number: student.va_number || '',
            });
        }
    }, [student]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!student) return;
        
        post(route('master.students.register-card', student.id), {
            onSuccess: () => onHide(), // Tutup modal jika sukses
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrasi Kartu: {student?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="rfid_uid">RFID UID</Form.Label>
                        <Form.Control
                            id="rfid_uid"
                            value={data.rfid_uid}
                            onChange={e => setData('rfid_uid', e.target.value)}
                            isInvalid={!!errors.rfid_uid}
                            placeholder="Tap atau ketik UID kartu..."
                            autoFocus
                        />
                        <Form.Control.Feedback type="invalid">{errors.rfid_uid}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="va_number">Nomor Virtual Account</Form.Label>
                        <Form.Control
                            id="va_number"
                            value={data.va_number}
                            onChange={e => setData('va_number', e.target.value)}
                            isInvalid={!!errors.va_number}
                            placeholder="Masukkan nomor VA..."
                        />
                        <Form.Control.Feedback type="invalid">{errors.va_number}</Form.Control.Feedback>
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" onClick={onHide}>Batal</Button>
                        <Button type="submit" variant="primary" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}