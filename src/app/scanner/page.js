"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation
// Styles
import "../../components/qrstyles.css";
// Qr Scanner
import QrScanner from "qr-scanner";
import ProfileGuard from "@/components/pfpcheck";

const QrReader = () => {
  // QR States
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const router = useRouter(); // Initialize the router

  // Result
  const [scannedResult, setScannedResult] = useState("");

  const onScanSuccess = (result) => {
    console.log(result);
    // Stop the scanner
    scanner.current.stop();

    // Redirect to the URL in the QR code
    if (result?.data) {
      router.push(result.data); // Redirect to the scanned URL
      //router.push("/questions/someId"); // Example static redirect
    }
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <ProfileGuard>
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>

      {/* Show Data Result if scan is success */}
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
    </ProfileGuard>
  );
};

export default QrReader;
