import AppPagination from "@/components/app-pagination";
import DataTable from "@/components/data-table";
import EmptyData from "@/components/empty-data";
import { useQueryParams } from "@/hooks/use-query-params";
import AppLayout, { MySwalTheme } from "@/layouts/app-layout";
import AppPageHeader from "@/layouts/app-page-header";
import { FlashProps, MetaOptions, MetaPagination } from "@/types";
import { Attendance } from "@/types/attendance";
import { Head, router, usePage } from "@inertiajs/react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Badge, Container, Dropdown } from "react-bootstrap";
import { PiDotsThreeOutlineDuotone, PiSpeedometerDuotone } from "react-icons/pi";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/id";
moment.locale('id');

interface Props {
    metaOptions: MetaOptions;
    responseData: {
        data: Attendance[];
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

    const handleDelete = (attendance: Attendance) => {
        MySwalTheme.fire({
            title: "Are you sure?",
            html: `This attendance for <b>"${attendance.student?.name}"</b> will be permanently deleted.<br/><small class="text-danger">This action cannot be undone.</small>`,
            icon: "question",
            confirmButtonText: "Delete",
            showCancelButton: true,
        }).then((val) => {
            if (val.isConfirmed) {
                return router.delete(route('attendances.destroy', attendance.id));
            }
        });
    }

    const columnHelper = createColumnHelper<Attendance>();

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
                        <Dropdown.Item onClick={() => handleDelete(info.row.original)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
            header: 'Actions'
        }),
        columnHelper.accessor('student', {
            cell: info => (
                <div className="text-start">
                    <div className="small">
                        <Badge bg="dark-subtle" className="text-dark-emphasis">{info.row.original.student?.reg_id}</Badge>
                    </div>
                    <div>{info.row.original.student?.name}</div>
                </div>
            ),
            header: () => <div className="text-start">Nama Siswa</div>
        }),
        columnHelper.display({
            id: 'school',
            enableSorting: false,
            cell: (info) => (
                <div className="text-start">{info.row.original.student?.school?.name}</div>
            ),
            header: 'Nama Sekolah'
        }),
        columnHelper.accessor('date', {
            cell: info => <div className="text-start">{moment(info.getValue()).format('DD MMMM YYYY')}</div>,
            header: () => <div className="text-start">Tanggal</div>
        }),
        columnHelper.accessor('time_in', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Absen Datang</div>
        }),
        columnHelper.accessor('time_out', {
            cell: info => <div className="text-start">{info.getValue()}</div>,
            header: () => <div className="text-start">Absen Pulang</div>
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
                        title: metaOptions.title,
                        active: true,
                    },
                ]}
            />

            <Container className="p-0">
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
            </Container>
        </AppLayout>
    )
}
