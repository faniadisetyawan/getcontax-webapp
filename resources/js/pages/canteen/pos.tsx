import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { FormEvent, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Product } from "@/types/products";
import axios from "axios";

interface CartItemState {
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
}

interface StudentBalance {
    name: string;
    balance: number;
    balance_formatted: string;
}

interface Props {
    products: Product[];
}

export default function CanteenPOSPage({ products }: Props) {
    const [cart, setCart] = useState<CartItemState[]>([]);
    const [rfid, setRfid] = useState('');
    const [barcode, setBarcode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [checkedStudent, setCheckedStudent] = useState<StudentBalance | null>(null);


    const handleCheckBalance = () => {
        if (!rfid) {
            toast.warn('Silakan tap kartu RFID terlebih dahulu.');
            return;
        }

        axios.post(route('api.canteen.check-balance'), { rfid_uid: rfid })
            .then(response => {
                setCheckedStudent(response.data.data);
                setShowBalanceModal(true);
            })
            .catch(error => {
                toast.error(error.response?.data?.message || 'Data tidak ditemukan.');
            });
    };

    const handleScan = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const product = products.find(p => p.barcode === barcode || p.sku === barcode);

        if (product) {
            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.product_id === product.id);
                if (existingItem) {
                    return prevCart.map(item =>
                        item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    return [...prevCart, {
                        product_id: product.id, name: product.name, quantity: 1,
                        price: product.price, discount: product.discount_nominal
                    }];
                }
            });
            toast.success(`${product.name} ditambahkan.`);
        } else {
            toast.error('Produk tidak ditemukan!');
        }
        setBarcode(''); 
    };

    const handlePayment = () => {
        if (cart.length === 0 || !rfid) {
            toast.warn('Keranjang atau RFID tidak boleh kosong!');
            return;
        }
        setIsSubmitting(true);

        axios.post(route('api.canteen.checkout'), {
            rfid_uid: rfid,
            cart: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        })
        .then(response => {
            toast.success(response.data.message);
            setCart([]);
            setRfid('');
            
            router.reload({ only: ['student', 'flash'] });

        })
        .catch(error => {
            const errorMsg = error.response?.data?.message || 'Transaksi Gagal.';
            toast.error(errorMsg);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };
    
    const handleRemoveItem = (productIdToRemove: number) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productIdToRemove));
        toast.info('Item dihapus dari keranjang.');
    };

    const totalPurchase = cart.reduce((sum, item) => {
        const finalPrice = item.price - item.discount;
        return sum + (finalPrice * item.quantity);
    }, 0);

    return (
        <AppLayout>
            <Head title="POS Kantin" />
            
            <Form onSubmit={handleScan}>
                <InputGroup>
                    <Form.Control
                        ref={barcodeInputRef}
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Scan barcode produk..."
                        autoFocus
                    />
                </InputGroup>
            </Form>

            <h4 className="mt-4">Keranjang</h4>
            <Table striped bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Nama Produk</th>
                        <th className="text-center">Jumlah</th>
                        <th className="text-end">Harga Satuan</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.length > 0 ? (
                        cart.map((item, index) => {
                            const finalPrice = item.price - item.discount;
                            const subtotal = finalPrice * item.quantity;
                            return (
                                <tr key={item.product_id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">Rp {finalPrice.toLocaleString('id-ID')}</td>
                                    <td className="text-end">Rp {subtotal.toLocaleString('id-ID')}</td>
                                    <td className="text-center">
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.product_id)}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">
                                Keranjang masih kosong. Silakan scan barang.
                            </td>
                        </tr>
                    )}
                </tbody>
                {cart.length > 0 && (
                    <tfoot className="table-light">
                        <tr>
                            <th colSpan={4} className="text-end">Total Belanja</th>
                            <th className="text-end">Rp {totalPurchase.toLocaleString('id-ID')}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                )}
            </Table>

            <div className="mt-4">
                <h4>Total: Rp {totalPurchase.toLocaleString('id-ID')}</h4>
                <InputGroup>
                    <Form.Control
                        value={rfid}
                        onChange={e => setRfid(e.target.value)}
                        placeholder="Tap kartu RFID siswa di sini..."
                    />
                    <Button onClick={handlePayment} disabled={isSubmitting}>
                        {isSubmitting ? 'Memproses...' : 'Bayar'}
                    </Button>
                    <Button variant="secondary" onClick={handleCheckBalance}>
                        Cek Saldo
                    </Button>
                </InputGroup>
            </div>

            <Modal show={showBalanceModal} onHide={() => setShowBalanceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Informasi Saldo</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h3>{checkedStudent?.name}</h3>
                    <p className="lead">Saldo Saat Ini:</p>
                    <h2 className="fw-bold">{checkedStudent?.balance_formatted}</h2>
                </Modal.Body>
            </Modal>
        </AppLayout>
    );
}
