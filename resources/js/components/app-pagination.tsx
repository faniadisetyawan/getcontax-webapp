import { Form, Pagination } from "react-bootstrap";

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    perPageOptions?: number[];
    className?: string;
}

export default function AppPagination({
    meta,
    onPageChange,
    onPerPageChange,
    perPageOptions = [10, 20, 30, 40, 50],
    className = '',
}: PaginationProps) {
    const { current_page, last_page, per_page, total, from, to } = meta;

    return (
        <div
            className={`d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 ${className}`}
        >
            {onPerPageChange && (
                <div className="d-flex gap-2 align-items-center">
                    <span className="small text-muted">Items per page:</span>
                    <Form.Select
                        value={per_page}
                        onChange={e => onPerPageChange(Number(e.target.value))}
                        style={{ width: '80px' }}
                        size="sm"
                        className="text-center"
                    >
                        {perPageOptions.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            )}

            <Pagination className="mb-0" size="sm">
                <Pagination.First
                    onClick={() => onPageChange(1)}
                    disabled={current_page === 1}
                />
                <Pagination.Prev
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                />

                {/* Show max 5 pages surrounding current page */}
                {Array.from({ length: last_page }, (_, i) => i + 1)
                    .filter(
                        page =>
                            page === 1 ||
                            page === last_page ||
                            (page >= current_page - 2 && page <= current_page + 2)
                    )
                    .map(page => (
                        <Pagination.Item
                            key={page}
                            active={page === current_page}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}

                <Pagination.Next
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                />
                <Pagination.Last
                    onClick={() => onPageChange(last_page)}
                    disabled={current_page === last_page}
                />
            </Pagination>

            <div className="small text-muted">
                Showing {from} to {to} of {total} entries
            </div>
        </div>
    );
}
