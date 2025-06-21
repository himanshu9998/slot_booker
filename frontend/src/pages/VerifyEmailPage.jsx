import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage(data.error || "Verification failed.");
        }
      });
  }, []);

  return <div><h2>{message}</h2></div>;
};

export default VerifyEmailPage;
