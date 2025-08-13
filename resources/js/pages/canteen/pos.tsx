import { useQueryParams } from "@/hooks/use-query-params";
import AppLayout, { MySwalTheme } from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { FlashProps, MetaOptions, MetaPagination } from "@/types"
import { Head, router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Badge, Button, Dropdown, Form, Image, InputGroup, Table } from "react-bootstrap";
import { PiDotsThreeOutlineDuotone, PiMagnifyingGlassDuotone, PiSpeedometerDuotone } from "react-icons/pi";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import EmptyData from "@/components/empty-data";
import AppPagination from "@/components/app-pagination";
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

// Props dari controller
interface Props {
    products: Product[];
}

export default function CanteenPOSPage({ products }: Props) {
    // const { flash } = usePage<FlashProps>().props;
    // const [params, setParams] = useQueryParams();
    // const [searchValue, setSearchValue] = useState(params.search || '');
    
    const [cart, setCart] = useState<CartItemState[]>([]);
    const [rfid, setRfid] = useState('');
    const [barcode, setBarcode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

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
        setBarcode(''); // Kosongkan input setelah scan
    };

    // Fungsi untuk memproses pembayaran
    const handlePayment = () => {
        if (cart.length === 0 || !rfid) {
            toast.warn('Keranjang atau RFID tidak boleh kosong!');
            return;
        }
        setIsSubmitting(true);
        // router.post(route('api.canteen.checkout'), {
        //     rfid_uid: rfid,
        //     cart: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        // }, {
        //     onSuccess: () => {
        //         toast.success('Pembayaran berhasil!');
        //         setCart([]);
        //         setRfid('');
        //     },
        //     onError: (errors) => {
        //         const errorMsg = errors.message || Object.values(errors)[0];
        //         toast.error(errorMsg);
        //     },
        //     onFinish: () => setIsSubmitting(false),
        // });
        axios.post(route('api.canteen.checkout'), {
            rfid_uid: rfid,
            cart: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        })
        .then(response => {
            // 'then' akan berjalan jika request berhasil (status 2xx)
            toast.success(response.data.message); // Ambil pesan dari respons JSON
            setCart([]); // Kosongkan keranjang
            setRfid('');
            
            // Penting: Beritahu Inertia untuk memuat ulang data props yang mungkin berubah
            // (misalnya data siswa untuk update saldo di layar)
            router.reload({ only: ['student', 'flash'] });

        })
        .catch(error => {
            // 'catch' akan berjalan jika request gagal (status 4xx atau 5xx)
            const errorMsg = error.response?.data?.message || 'Transaksi Gagal.';
            toast.error(errorMsg);
        })
        .finally(() => {
            // 'finally' akan selalu berjalan setelah request selesai
            setIsSubmitting(false);
        });
    };
    
    const handleRemoveItem = (productIdToRemove: number) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productIdToRemove));
        toast.info('Item dihapus dari keranjang.');
    };

    // Hitung total belanja
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
                </InputGroup>
            </div>
        </AppLayout>
    );
}
