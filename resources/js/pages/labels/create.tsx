import AppLayout from '@/layouts/app-layout';
import { MetaOptions } from '@/types';
import { Product } from '@/types/products';
import { Head } from '@inertiajs/react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

interface Props {
    metaOptions: MetaOptions;
    products: Product[];
}

export default function PrintLabelPage({ metaOptions, products }: Props) {
    return (
        <AppLayout>
            <Head title={metaOptions.title} />
            
            <Container>
                <h3>Cetak Label Barcode</h3>
                <p>Pilih produk dan masukkan jumlah label yang ingin dicetak.</p>

                <form action={route('canteens.print.store')} method="POST">
                    <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Pilih Produk</Form.Label>
                                <Form.Select name="product_id" required>
                                    <option value="">-- Pilih Produk --</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku || product.barcode})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                             <Form.Group className="mb-3">
                                <Form.Label>Jumlah Cetak</Form.Label>
                                <Form.Control name="quantity" type="number" defaultValue={1} min={1} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" variant="primary">Generate & Cetak PDF</Button>
                </form>
            </Container>
        </AppLayout>
    );
}