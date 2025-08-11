import AppLogo from "@/components/app-logo";
import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import classNames from "classnames";
import { Fragment } from "react";
import { Form, Image, NavDropdown } from "react-bootstrap";
import { PiDotDuotone, PiMagnifyingGlassDuotone, PiToggleRightDuotone } from "react-icons/pi";

interface AppHeaderProps {
    setIsSidebarMobileOpen: (open: boolean) => void;
}

export default function AppHeader({ setIsSidebarMobileOpen }: AppHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const { url } = usePage();

    return (
        <header className="app-header">
            <Fragment>
                <div className="d-flex align-items-center gap-2 d-lg-none">
                    <div
                        className="text-info"
                        onClick={() => setIsSidebarMobileOpen(true)}
                    >
                        <PiToggleRightDuotone className="fs-1" />
                    </div>
                    <AppLogo style={{ height: 45 }} />
                </div>

                <div className="d-none d-lg-flex align-items-center gap-3">
                    <div className="app-input-group">
                        <div className="app-input-group-icon">
                            <PiMagnifyingGlassDuotone />
                        </div>
                        <Form.Control
                            type="search"
                            name="q"
                            placeholder="NISN..."
                            className="border-0"
                        />
                    </div>
                    <Link
                        href={route('dashboard')}
                        className={classNames('top-link', {
                            'active': url.startsWith('/master/members/create')
                        })}
                    >
                        <PiDotDuotone className="fs-3" />
                        <span>Tambah Siswa</span>
                    </Link>
                </div>
            </Fragment>

            <div className="d-flex align-items-center gap-3">
                <NavDropdown
                    as="div"
                    title={
                        <span className="d-flex align-items-center gap-2">
                            <Image
                                src={"/assets/user-placeholder.png"}
                                roundedCircle
                                width={35}
                                height={35}
                                alt="User Avatar"
                                className="bg-white img-thumbnail"
                            />
                            <span className="d-none d-md-block">{auth.user?.name || "Guest"}</span>
                        </span>
                    }
                    id="auth-nav-dropdown"
                    align="end"
                    className="dropdown-avatar"
                >
                    <NavDropdown.Item as={Link} method="post" href={route('logout')}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
        </header>
    )
}
