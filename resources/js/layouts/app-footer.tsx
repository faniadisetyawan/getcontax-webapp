import { Col, Container, Row } from "react-bootstrap";

export default function AppFooter() {
    return (
        <footer className="app-footer">
            <div className="app-footer-content">
                <Container className="p-0 small text-muted">
                    <Row className="gy-0">
                        <Col md={6}>
                            <div className="d-inline">
                                <span>Copyright &copy; 2025&nbsp;</span>
                                <a href="https://faniadi.com" target="_blank" rel="noopener noreferrer">
                                    <b className="text-primary">FaniDEV</b>
                                </a>
                                <span>&nbsp;- All right reserved.</span>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mt-2 mt-md-0 text-center text-md-end">Made with <b className="text-danger">♥</b> - Indonesia</div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    )
}
