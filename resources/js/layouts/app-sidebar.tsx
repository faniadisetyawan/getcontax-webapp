import { Link, usePage } from "@inertiajs/react";
import { Fragment, JSX, useEffect, useState } from "react";
import { Collapse, Nav } from "react-bootstrap";
import {
    PiBowlFoodDuotone,
    PiBriefcaseDuotone,
    PiChartLineUpDuotone,
    PiHandCoinsDuotone,
    PiIdentificationBadgeDuotone,
    PiMoneyDuotone,
    PiNotebookDuotone,
    PiSpeedometerDuotone,
    PiToggleLeftDuotone,
    PiToggleRightDuotone,
    PiXCircleDuotone
} from "react-icons/pi";
import { RxChevronRight } from "react-icons/rx";
import classNames from "classnames";
import { useIsMobile } from "@/hooks/use-mobile";
import AppLogo from "@/components/app-logo";


interface NavItem {
    label: string;
    url?: string;
    icon?: JSX.Element;
    children?: NavItem[];
    isHeading?: boolean;
}

const items: NavItem[] = [
    {
        label: 'Statistics',
        isHeading: true,
    },
    {
        label: 'Dashboard',
        url: '/dashboard',
        icon: <PiSpeedometerDuotone className="nav-icon" />,
    },
    {
        label: 'Master',
        isHeading: true,
    },
    {
        label: 'Sekolah',
        url: '/master/schools',
        icon: <PiBriefcaseDuotone className="nav-icon" />,
    },
    {
        label: 'Features',
        isHeading: true,
    },
    {
        label: 'Kantin',
        url: '/canteens',
        icon: <PiBowlFoodDuotone className="nav-icon" />,
        children: [
            {
                label: 'Inventory',
                url: '/canteens/inventory',
            },
            {
                label: 'Point of Sales',
                url: '/canteens/pos',
            },
            {
                label: 'Print Label Barcode',
                url: '/canteens/label/print',
            },
            {
                label: 'Keuangan Kantin',
                url: '/finance/canteen',
            },
        ],
    },
    {
        label: 'Keuangan',
        url: '/finance',
        icon: <PiMoneyDuotone className="nav-icon" />,
        children: [
            {
                label: 'Keuangan Kantin',
                url: '/finance/canteen',
            },
        ],
    },
];

// Helper: cari path aktif di tree, return array index per level
function findActivePath(items: NavItem[], url: string, path: number[] = []): number[] {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (url.startsWith(item.url!!)) {
            if (item.children) {
                const childPath = findActivePath(item.children, url, [...path, i]);
                if (childPath.length) return childPath;
            }
            return [...path, i];
        }
    }
    return [];
}

interface AppSidebarProps {
    isSidebarMobileOpen: boolean;
    setIsSidebarMobileOpen: (open: boolean) => void;
}

export default function AppSidebar({ isSidebarMobileOpen, setIsSidebarMobileOpen }: AppSidebarProps) {
    const { url } = usePage<{ url: string }>();
    const isMobile = useIsMobile();

    // Simpan open index per level, misal: [1,0] artinya menu ke-1 terbuka, submenu ke-0 terbuka
    const activePath = findActivePath(items, url);
    const [openIdx, setOpenIdx] = useState<number[]>(activePath);
    // Initialize sidebarSize from localStorage, but force 'lg' on mobile
    const [sidebarSize, setSidebarSize] = useState<string>(() => {
        return isMobile ? 'lg' : (localStorage.getItem('sidebarSize') || 'lg');
    });
    const [isSidebarHover, setIsSidebarHover] = useState(false);

    // Toggle sidebar size only for desktop
    const toggleSidebarSize = () => {
        if (!isMobile) {
            const newSize = sidebarSize === 'lg' ? 'sm' : 'lg';
            setSidebarSize(newSize);
            localStorage.setItem('sidebarSize', newSize);
        }
    };

    // Toggle accordion per level
    const handleAccordion = (level: number, idx: number) => {
        if (sidebarSize === "sm" && !isSidebarHover) return; // Disable toggle in small mode
        setOpenIdx(prev => {
            const newOpen = prev.slice(0, level);
            newOpen[level] = prev[level] === idx ? -1 : idx;
            return newOpen;
        });
    };

    // Recursive render
    const renderNav = (navItems: NavItem[], level = 0, parentIdxPath: number[] = []): JSX.Element => (
        <Nav
            className={classNames(
                level === 0 ? "flex-column" : "flex-column nav-children",
                { "nav-nested-small": level >= 2 }
            )}
        >
            {navItems.map((item, idx) => {
                const idxPath = [...parentIdxPath, idx];
                const isOpen = openIdx[level] === idx;
                const isActive = url.startsWith(item.url!!);
                const hasChildren = !!item.children;
                const isHeading = !!item?.isHeading && item.isHeading === true;

                if (isHeading) {
                    return (
                        <Nav.Item key={idxPath.join("-")}>
                            <div className="nav-heading">
                                {sidebarSize === "sm" && !isSidebarHover ? (
                                    <span className="nav-heading-dots">•••</span>
                                ) : (
                                    item.label
                                )}
                            </div>
                        </Nav.Item>
                    )
                }

                if (hasChildren) {
                    return (
                        <Fragment key={idxPath.join("-")}>
                            <Nav.Item>
                                <button
                                    className={classNames(
                                        'nav-link',
                                        { 'active': isActive || isOpen }
                                    )}
                                    onClick={() => handleAccordion(level, idx)}
                                    type="button"
                                    tabIndex={sidebarSize === "sm" ? -1 : 0}
                                >
                                    {!!item.icon ? item.icon : <i className="bi bi-dash nav-icon-children"></i>}
                                    <span className="nav-title">{item.label}</span>
                                    <RxChevronRight className={classNames("nav-arrow", { "rotate-90": isOpen })} />
                                </button>
                            </Nav.Item>
                            <Collapse in={isOpen && (sidebarSize !== "sm" || isSidebarHover)}>
                                <div>
                                    {renderNav(item.children!, level + 1, idxPath)}
                                </div>
                            </Collapse>
                        </Fragment>
                    );
                }

                return (
                    <Nav.Item key={idxPath.join("-")}>
                        <Nav.Link
                            as={Link}
                            href={item.url}
                            className={classNames({ 'active': isActive })}
                        >
                            {!!item.icon ? item.icon : <i className="bi bi-dash nav-icon-children"></i>}
                            <span className="nav-title">{item.label}</span>
                        </Nav.Link>
                    </Nav.Item>
                );
            })}
        </Nav>
    );

    // Update document attributes when sidebar size changes
    useEffect(() => {
        if (sidebarSize === "sm") {
            setOpenIdx([]);
        }
        document.documentElement.setAttribute('data-sidebar-size', sidebarSize);
        document.documentElement.setAttribute('data-sidebar-hover', isSidebarHover ? "true" : "false");
    }, [sidebarSize, isSidebarHover]);

    // useEffect(() => {
    //     document.documentElement.setAttribute('data-bs-theme', 'dark');
    // }, []);

    // Only set mobile view attribute, remove sidebar size reset
    useEffect(() => {
        document.documentElement.setAttribute('data-mobile-view', isMobile ? "true" : "false");
    }, [isMobile]);

    // Update sidebarSize when isMobile changes
    useEffect(() => {
        if (isMobile) {
            setSidebarSize('lg');
        } else {
            // Restore from localStorage when switching back to desktop
            setSidebarSize(localStorage.getItem('sidebarSize') || 'lg');
        }
    }, [isMobile]);

    return (
        <Fragment>
            {/* Overlay for mobile */}
            {isSidebarMobileOpen && (
                <div
                    className="app-sidebar-overlay"
                    onClick={() => setIsSidebarMobileOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            <aside
                className={classNames("app-sidebar", {
                    "sidebar-overlay-open": sidebarSize === "sm" && isSidebarHover,
                    "sidebar-mobile-open": isSidebarMobileOpen,
                })}
                onMouseEnter={() => sidebarSize === "sm" && setIsSidebarHover(true)}
                onMouseLeave={() => sidebarSize === "sm" && setIsSidebarHover(false)}
            >
                <div className="app-sidebar-header">
                    <div className="app-sidebar-brand">
                        <Link href={route('dashboard')}>
                            <AppLogo style={{ height: 45 }} />
                        </Link>
                    </div>
                    <div className="app-sidebar-toggle"
                        onClick={() => {
                            if (isMobile) {
                                setIsSidebarMobileOpen(false);
                            } else {
                                toggleSidebarSize();
                            }
                        }}
                    >
                        {!isMobile ? (
                            <Fragment>
                                {sidebarSize === 'lg' ?
                                    <PiToggleLeftDuotone className="fs-3" />
                                    :
                                    <PiToggleRightDuotone className="fs-3" />
                                }
                            </Fragment>
                        ) : (
                            <PiXCircleDuotone className="fs-3" />
                        )}
                    </div>
                </div>
                <div className="app-sidebar-body">
                    {renderNav(items)}
                </div>
            </aside>
        </Fragment>
    );
}
