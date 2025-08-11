import { Table as ReactTable, flexRender } from "@tanstack/react-table";
import { Table as BootstrapTable } from "react-bootstrap";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { QueryParams } from "@/hooks/use-query-params";

interface DataTableProps<T> {
    table: ReactTable<T>;
    params: QueryParams;
    onSort: (columnId: string) => void;
    defaultSortColumn?: string;
}

export default function DataTable<T>({ table, params, onSort, defaultSortColumn = 'created_at' }: DataTableProps<T>) {
    return (
        <BootstrapTable responsive hover className="table-theme align-middle">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        className={
                                            header.column.getCanSort()
                                                ? "cursor-pointer select-none d-flex align-items-center gap-2"
                                                : "d-flex align-items-center gap-2"
                                        }
                                        onClick={
                                            header.column.getCanSort()
                                                ? () => onSort(header.column.id)
                                                : undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {header.column.getCanSort() && (
                                            params.sort === header.column.id ? (
                                                params.order === 'asc'
                                                    ? <PiCaretUpBold className="text-primary" />
                                                    : <PiCaretDownBold className="text-primary" />
                                            ) : (
                                                header.column.id === defaultSortColumn && !params.sort &&
                                                <PiCaretDownBold className="text-primary opacity-50" />
                                            )
                                        )}
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </BootstrapTable>
    );
}