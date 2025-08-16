import { useQueryParams } from "@/hooks/use-query-params";
import AppLayout, { MySwalTheme } from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { FlashProps, MetaOptions, MetaPagination } from "@/types"
import { Head, router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Image } from "react-bootstrap";
import { PiDotsThreeOutlineDuotone, PiMagnifyingGlassDuotone, PiSpeedometerDuotone } from "react-icons/pi";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "@/components/data-table";
import EmptyData from "@/components/empty-data";
import AppPagination from "@/components/app-pagination";
import { toast } from "react-toastify";
import { Student } from "@/types/students";
import RegisterCardModal from "@/components/RegisterCardModal";

interface Props {
    metaOptions: MetaOptions;
    responseData: {
        data: Student[];
        meta: MetaPagination;
    };
}

export default function IndexPage({ metaOptions, responseData }: Props) {
    const { flash } = usePage<FlashProps>().props;
    const [params, setParams] = useQueryParams();
    const [searchValue, setSearchValue] = useState(params.search || '');
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const handleOpenModal = (student: Student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };
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

    const handleDelete = (student: Student) => {
        MySwalTheme.fire({
            title: "Are you sure?",
            html: `This <b>"${student.name}"</b> will be permanently deleted.<br/><small class="text-danger">This action cannot be undone.</small>`,
            icon: "question",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then((val) => {
            if (val.isConfirmed) {
                return router.delete(route('master.students.destroy', student.id));
            }
        });
    }

    const columnHelper = createColumnHelper<Student>();

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
                        <Dropdown.Item onClick={() => router.visit(route('master.students.edit', info.row.original.id))} role="button">Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleOpenModal(info.row.original)}>Set RFID & VA</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(info.row.original)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
            header: 'Actions'
        }),
        columnHelper.accessor('name', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Nama Siswa</div>
        }),
        columnHelper.accessor('nisn', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">NISN</div>
        }),
        columnHelper.accessor('rfid_uid', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">RFID UID</div>
        }),
        columnHelper.accessor('va_number', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Nomor VA</div>
        }),
        columnHelper.accessor('balance', {
            cell: info => {
                const value = info.getValue();
                const numericValue = Number(value);
                return (
                    <div className="text-end">
                        {'Rp ' + numericValue.toLocaleString('id-ID')}
                    </div>
                );
            },
            header: () => <div className="text-start">Saldo</div>
        }),
        columnHelper.accessor('gender', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Jenis Kelamin</div>
        }),
        columnHelper.accessor('status', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Status</div>
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
                        title: 'Master',
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
                    <Button variant="primary" onClick={() => router.visit(route('master.students.create'))}>Tambah</Button>
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

            <RegisterCardModal
                show={showModal}
                onHide={() => setShowModal(false)}
                student={selectedStudent}
            />
        </AppLayout>
    )
}
