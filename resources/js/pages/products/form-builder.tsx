import UploadImage from "@/components/upload-image";
import AppLayout from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { MetaOptions } from "@/types";
import { Product } from "@/types/products";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PiSpeedometerDuotone } from "react-icons/pi";

interface Props {
    metaOptions: MetaOptions;
    old: Product | null;
}

export default function FormBuilder({ metaOptions, old }: Props) {
    const { data, setData, errors, post, processing, clearErrors } = useForm({
    name: '',
    sku: '',
    barcode: '',
    price: 0,
    discount_nominal: 0,
    stock: 0,
    is_consignment: false as boolean,
    is_available: true as boolean,
    });

    useEffect(() => {
        if (!!old && old?.id) {
            setData(prev => ({
                ...prev,
                name: old?.name ?? '',
                sku: old?.sku ?? '',
                barcode: old?.barcode ?? '',
                price: old?.price ?? 0,
                discount_nominal: old?.discount_nominal ?? 0,
                stock: old?.stock ?? 0,
                is_consignment: old.is_consignment,
                is_available: old.is_available,
            }));
        }
    }, [old]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!old) {
            post(route('canteens.inventory.store'), {
                forceFormData: true,
            });
        } else {
            Object.assign(data, { _method: 'PUT' });
            post(route('canteens.inventory.update', old?.id), {
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
                        title: 'Inventory',
                        url: route('canteens.inventory.index'),
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
                        <Col md={8}>
                            <Card body className="py-3 px-md-4">
                                {old && ( // Tampilkan hanya jika mode edit
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="sku">SKU (Dibuat Otomatis)</Form.Label>
                                        <Form.Control id="sku" value={old.sku} readOnly />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="name" className="required">Nama Produk</Form.Label>
                                    <Form.Control id="name" value={data.name} onChange={e => setData('name', e.target.value)} isInvalid={!!errors.name} />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="barcode">Barcode</Form.Label>
                                    <Form.Control id="barcode" value={data.barcode} onChange={e => setData('barcode', e.target.value)} isInvalid={!!errors.barcode} />
                                    <Form.Text>Scan atau ketik manual. Kosongkan untuk produk internal.</Form.Text>
                                    <Form.Control.Feedback type="invalid">{errors.barcode}</Form.Control.Feedback>
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="price" className="required">Harga</Form.Label>
                                            <Form.Control id="price" type="number" value={data.price} onChange={e => setData('price', Number(e.target.value))} isInvalid={!!errors.price} />
                                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="discount_nominal">Diskon (Nominal)</Form.Label>
                                            <Form.Control id="discount_nominal" type="number" value={data.discount_nominal} onChange={e => setData('discount_nominal', Number(e.target.value))} isInvalid={!!errors.discount_nominal} />
                                            <Form.Control.Feedback type="invalid">{errors.discount_nominal}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="stock" className="required">Stok</Form.Label>
                                    <Form.Control id="stock" type="number" value={data.stock} onChange={e => setData('stock', Number(e.target.value))} isInvalid={!!errors.stock} />
                                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                                </Form.Group>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card body className="py-3 px-md-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Jenis Produk</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="is_consignment"
                                        label="Barang Titipan (Konsinyasi)"
                                        checked={data.is_consignment}
                                        onChange={e => setData('is_consignment', e.target.checked)}
                                    />
                                </Form.Group>
                                <hr />
                                <Form.Group className="mb-3">
                                    <Form.Label>Status Ketersediaan</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="is_available"
                                        label="Tersedia untuk dijual"
                                        checked={data.is_available}
                                        onChange={e => setData('is_available', e.target.checked)}
                                    />
                                </Form.Group>
                            </Card>
                        </Col>
                    </Row>
                    <hr className="border-dashed" />
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
                        <Button type="button" variant="light" onClick={() => router.visit(route('canteens.inventory.index'))}>Cancel</Button>
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

