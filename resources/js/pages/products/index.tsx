import { useQueryParams } from "@/hooks/use-query-params";
import AppLayout, { MySwalTheme } from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { FlashProps, MetaOptions, MetaPagination } from "@/types"
import { Head, router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Badge, Button, Dropdown, Form, Image } from "react-bootstrap";
import { PiDotsThreeOutlineDuotone, PiMagnifyingGlassDuotone, PiSpeedometerDuotone } from "react-icons/pi";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import EmptyData from "@/components/empty-data";
import AppPagination from "@/components/app-pagination";
import { toast } from "react-toastify";
import { Product } from "@/types/products";
import Barcode from "react-barcode";

interface Props {
    metaOptions: MetaOptions;
    responseData: {
        data: Product[];
        meta: MetaPagination;
    };
}

export default function IndexPage({ metaOptions, responseData }: Props) {
    const { flash } = usePage<FlashProps>().props;
    const [params, setParams] = useQueryParams();
    const [searchValue, setSearchValue] = useState(params.search || '');

    useEffect(() => {
        if (!!flash && flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const debouncedSearch = debounce((value: string) => {
        setParams({ search: value, page: 1 });
    }, 1000);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSort = (columnId: string) => {
        const isDesc = params.sort === columnId && params.order === 'desc';
        const newOrder = isDesc ? 'asc' : 'desc';
        setParams({
            sort: columnId,
            order: newOrder,
            page: 1
        });
    };

    const handlePageChange = (page: number) => {
        setParams({ page });
    };

    const handlePerPageChange = (perPage: number) => {
        setParams({
            per_page: perPage,
            page: 1
        });
    };

    const handleDelete = (product: Product) => {
        MySwalTheme.fire({
            title: "Are you sure?",
            html: `This product <b>"${product.name}"</b> will be permanently deleted.<br/><small class="text-danger">This action cannot be undone.</small>`,
            icon: "question",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then((val) => {
            if (val.isConfirmed) {
                return router.delete(route('canteens.inventory.destroy', product.id));
            }
        });
    }

    const columnHelper = createColumnHelper<Product>();

    const columns = [
        columnHelper.display({
            id: 'actions',
            enableSorting: false,
            cell: (info) => (
                <Dropdown drop="end" className="no-caret">
                    <Dropdown.Toggle variant="light" id="dropdown-actions" size="sm">
                        <PiDotsThreeOutlineDuotone />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => router.visit(route('canteens.inventory.edit', info.row.original.id))} role="button">Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(info.row.original)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
            header: 'Actions'
        }),
        columnHelper.accessor('name', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Nama Produk</div>
        }),
        columnHelper.accessor('barcode', {
            header: () => <div className="text-start">Barcode</div>,
            cell: info => {
                const product = info.row.original;

                const hasBarcode = !!product.barcode; // Cek apakah barcode ada
                const hasSku = !!product.sku;       // Cek apakah SKU ada

                // Jika keduanya tidak ada, tampilkan strip
                if (!hasBarcode && !hasSku) {
                    return <span className="text-muted">-</span>;
                }

                // Jika ada, render satu atau keduanya
                return (
                    // Gunakan div untuk menumpuknya secara vertikal
                    <div>
                        {hasBarcode && (
                            <div className="mb-2">
                                <small className="text-muted d-block">Barcode Pabrikan</small>
                                <Barcode 
                                    value={product.barcode!} // Tanda seru (!) menandakan kita yakin nilainya ada
                                    height={40}
                                    width={1.5}
                                    displayValue={true}
                                    fontSize={10}
                                    margin={2}
                                />
                            </div>
                        )}

                        {hasSku && (
                            <div>
                                <small className="text-muted d-block">SKU Internal</small>
                                <Barcode 
                                    value={product.sku!}
                                    height={40}
                                    width={1.5}
                                    displayValue={true}
                                    fontSize={10}
                                    margin={2}
                                />
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        }),
        columnHelper.accessor('price', {
            cell: info => <div className="text-start">Rp {info.getValue().toLocaleString('id-ID')} </div>,
            header: () => <div className="text-start">Harga</div>
        }),
        columnHelper.accessor('discount_nominal', {
            cell: info => <div className="text-start">Rp {info.getValue().toLocaleString('id-ID')} </div>,
            header: () => <div className="text-start">Diskon</div>
        }),
        columnHelper.accessor('stock', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Stok</div>
        }),
        columnHelper.accessor('is_consignment', {
            cell: info => <Badge bg={info.getValue() ? 'info' : 'secondary'}>
                    {info.getValue() ? 'Konsinyasi' : 'Milik Sendiri'}
                </Badge>,
            header: () => <div className="text-start">Titipan</div>
        }),
        columnHelper.accessor('is_available', {
            cell: info => <Badge bg={info.getValue() ? 'success' : 'danger'}>
                    {info.getValue() ? 'Tersedia' : 'Tidak Tersedia'}
                </Badge>,
            header: () => <div className="text-start">Titipan</div>
        }),
    ];

    const table = useReactTable({
        data: responseData.data,
        columns,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        pageCount: responseData.meta.last_page,
        state: {
            pagination: {
                pageIndex: responseData.meta.current_page - 1,
                pageSize: responseData.meta.per_page,
            },
        },
        getCoreRowModel: getCoreRowModel(),
    });

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
                        title: 'Kantin',
                        active: true,
                    },
                    {
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="app-input-group">
                        <div className="app-input-group-icon">
                            <PiMagnifyingGlassDuotone />
                        </div>
                        <Form.Control
                            type="search"
                            name="search"
                            value={searchValue}
                            onChange={handleSearch}
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div>
                    <Button variant="primary" onClick={() => router.visit(route('canteens.inventory.create'))}>Tambah</Button>
                </div>
            </div>

            <DataTable
                table={table}
                params={params}
                onSort={handleSort}
                defaultSortColumn="code"
            />

            {responseData.meta.total === 0 && <EmptyData />}

            <AppPagination
                meta={responseData.meta}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />
        </AppLayout>
    )
}
