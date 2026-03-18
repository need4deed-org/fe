"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useEffectEvent } from "react";

export default function Page() {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const setVerifyingEvent = useEffectEvent(() => setVerifying(true));
  const { token } = useParams();

  useEffect(() => {
    setVerifyingEvent();
    if (!token) {
      console.error("No token provided for email verification.");
      return;
    }

    // Simulate an API call to verify the email with the token
    fetch(`/api/user/verify-email`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setVerified(true);
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      })
      .catch((err) => {
        console.error("Error verifying email:", err);
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      {verifying ? "Verifying..." : <p>{verified ? "Success!" : "Failure."}</p>}
    </div>
  );
}
