import { Head } from "@inertiajs/react";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Card, Image, Spinner } from "react-bootstrap";

interface StudentBalance {
  name: string;
  balance_formatted: string;
}

interface CheckBalanceResponse {
  success: boolean;
  message: string;
  data: StudentBalance;
}

interface Props {
    school: {
        name: string;
        logo_url: string;
    } | null;
}

export default function CheckBalanceKiosk({ school }: Props) {
  const [rfid, setRfid] = useState("");
  const [student, setStudent] = useState<StudentBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const rfidInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const focusInput = () => rfidInputRef.current?.focus();
    focusInput();
    document.addEventListener("click", focusInput);

    return () => {
      document.removeEventListener("click", focusInput);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRfidSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rfid.trim()) return;

    setIsLoading(true);
    setStudent(null);
    setError(null);

    axios
      .post<CheckBalanceResponse>(route("api.canteen.check-balance"), {
        rfid_uid: rfid,
      })
      .then((response) => {
        setStudent(response.data.data);
        timeoutRef.current = setTimeout(() => setStudent(null), 7000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Kartu tidak valid.");
        timeoutRef.current = setTimeout(() => setError(null), 7000);
      })
      .finally(() => {
        setRfid("");
        setIsLoading(false);
      });
  };

  return (
    <>
      <Head title="Cek Saldo" />
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center mb-4">
            {school?.logo_url && (
                <Image src={school.logo_url} alt="Logo Sekolah" style={{ height: '80px', marginBottom: '1rem' }} />
            )}
            {school?.name && (
                <h1 className="h3">{school.name}</h1>
            )}
        </div>
        <form onSubmit={handleRfidSubmit}>
          <input
            ref={rfidInputRef}
            type="text"
            value={rfid}
            onChange={(e) => setRfid(e.target.value)}
            style={{ position: "absolute", left: "-9999px" }}
          />
        </form>

        <Card
          body
          style={{ width: "600px", minHeight: "300px" }}
          className="shadow-lg text-center"
        >
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            {isLoading ? (
              <>
                <Spinner animation="border" variant="primary" />
                <h2 className="mt-3">Memproses...</h2>
              </>
            ) : student ? (
              <>
                <h1 className="display-4">{student.name}</h1>
                <p className="lead">Saldo Anda Saat Ini:</p>
                <h1 className="display-1 fw-bold text-success">
                  {student.balance_formatted}
                </h1>
              </>
            ) : error ? (
              <h2 className="text-danger">{error}</h2>
            ) : (
              <h1 className="display-4 text-muted">
                Silakan Tempelkan Kartu Anda
              </h1>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
