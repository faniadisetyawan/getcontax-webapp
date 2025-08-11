import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
import { Breadcrumb } from "react-bootstrap";

interface BreadcrumbItem {
    title: ReactNode;
    url?: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumb: BreadcrumbItem[],
}

export default function AppPageHeader({ title, description, breadcrumb }: PageHeaderProps) {
    return (
        <header className="mb-4 d-flex flex-column gap-3">
            {breadcrumb.length > 0 && (
                <Breadcrumb className="border-bottom">
                    {breadcrumb.map((item, idx) => {
                        if (!!item?.active && item.active) {
                            return (
                                <Breadcrumb.Item key={idx} active>{item.title}</Breadcrumb.Item>
                            )
                        }

                        return (
                            <Breadcrumb.Item
                                key={idx}
                                linkAs={Link}
                                href={item.url}
                            >{item.title}</Breadcrumb.Item>
                        )
                    })}
                </Breadcrumb>
            )}

            <div>
                <h4 className="mb-0 fw-bold">{title}</h4>
                {!!description && <div className="small text-muted">{description}</div>}
            </div>
        </header>
    )
}
