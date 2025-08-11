import AppLogo from "@/components/app-logo";
import AuthLayout from "@/layouts/auth-layout";
import { MetaOptions } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import classNames from "classnames";
import { FormEventHandler } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { PiLockKeyDuotone, PiUserDuotone } from "react-icons/pi";

interface PageProps {
    metaOptions: MetaOptions;
    status?: string;
    canResetPassword: boolean;
}

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login({ metaOptions, status, canResetPassword }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
    return (
        <AuthLayout>
            <Head title={metaOptions.title} />

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} xl={4}>
                        <Card body className="p-3 p-md-5">
                            <div className="text-center">
                                <AppLogo style={{ width: '100%' }} />
                            </div>
                            <hr className="my-4" />

                            <Form onSubmit={submit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email :</Form.Label>
                                    <div className={classNames('app-input-group', { 'is-invalid': !!errors.email })}>
                                        <div className="app-input-group-icon">
                                            <PiUserDuotone className="mb-1" />
                                        </div>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            isInvalid={!!errors.email}
                                            placeholder="Email"
                                            autoFocus
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <div className="mb-2 d-flex align-items-center justify-content-between gap-2">
                                        <Form.Label className="my-0">Password :</Form.Label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="small text-muted" tabIndex={5}>
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="app-input-group">
                                        <div className="app-input-group-icon">
                                            <PiLockKeyDuotone className="mb-1" />
                                        </div>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            isInvalid={!!errors.password}
                                            placeholder="Password"
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>

                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                        label="Remember me"
                                    />
                                </div>

                                <div className="mt-4 d-grid">
                                    <Button type="submit" variant="primary" className="btn-icon-label">
                                        <span>Log in</span>
                                        {processing &&
                                            <div className="spinner-grow spinner-grow-sm text-white" role="status" style={{ borderWidth: '0.1em' }}>
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        }
                                    </Button>
                                </div>
                            </Form>

                            {route().has('register') && (
                                <div className="mt-4 text-muted text-start small">
                                    Don't have an account?{' '}
                                    <Link href={route('register')} tabIndex={5}>
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </Card>

                        {!!status &&
                            <Alert variant="success" className="mt-4 mb-0 border-0">
                                <h6 className="fw-bold text-decoration-underline text-success">Success</h6>
                                <p className="mb-0 small text-success">{status}</p>
                            </Alert>
                        }
                    </Col>
                </Row>
            </Container>
        </AuthLayout>
    )
}
