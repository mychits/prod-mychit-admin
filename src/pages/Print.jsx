import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BiPrinter } from "react-icons/bi";
import { useParams } from "react-router-dom";
import api from "../instance/TokenInstance";
import mychitsLogo from "../assets/images/mychits.png"; 

const ReceiptComponent = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState({});

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(`/payment/get-payment-by-id/${id}`);
        if (response.data) {
          setPayment(response.data);
        } else {
          setPayment({});
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setPayment({});
      }
    };

    fetchPayment();
  }, [id]);

  const formatPayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrint = async () => {
    const receiptElement = document.getElementById("receipt");
    const scale = 2;

    const canvas = await html2canvas(receiptElement, { scale });
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = receiptElement.offsetWidth * 0.264583;
    const pdfHeight = receiptElement.offsetHeight * 0.264583;

    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Receipt.pdf");
  };

  return (
    <div
      style={{
        marginTop: "100px",
        paddingLeft: "10px",
        paddingRight: "10px",
        position: "relative",
      }}
    >
      <button
        onClick={handlePrint}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 12px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 1000,
        }}
      >
        <BiPrinter size={20} />
        Print
      </button>

      <div
        id="receipt"
        style={{
          width: "320px",
          backgroundColor: "#fff",
          padding: "20px",
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#222",
          lineHeight: "1.4",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={mychitsLogo}
            alt="Company Logo"
            style={{ width: "50px", margin: "0 auto 8px", display: "block" }}
          />
          <h2 style={{ margin: 0, fontWeight: "700" }}>MY CHITS</h2>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "#555" }}>
            No.11/36-25, 2nd Main, Kathriguppe Main Road,
            <br />
            Bangalore, 560085 | 9483900777
          </p>
          <hr style={{ borderColor: "#eee", margin: "12px 0" }} />
          <h3 style={{ margin: "8px 0" }}>Receipt</h3>
        </div>

        <div style={{ fontSize: "14px" }}>
          <p>
            <strong>Receipt No:</strong>{" "}
            {payment.receipt_no ? payment.receipt_no : payment.old_receipt_no}
          </p>
          <p>
            <strong>Date:</strong> {formatPayDate(payment.pay_date)}
          </p>
          <p>
            <strong>Name:</strong> {payment?.user_id?.full_name || "-"}
          </p>
          <p>
            <strong>Mobile No:</strong> {payment?.user_id?.phone_number || "-"}
          </p>
          <p>
            <strong>Group:</strong> {payment?.group_id?.group_name || "-"}
          </p>
          <p>
            <strong>Ticket:</strong> {payment?.ticket || "-"}
          </p>
        </div>

        <div
          style={{
            margin: "15px 0",
            padding: "10px",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            fontWeight: "700",
            fontSize: "16px",
            textAlign: "center",
            border: "1px solid #ccc",
            color: "#111",
          }}
        >
          Received Amount: Rs. {payment?.amount || "0"}
        </div>

        <div style={{ fontSize: "14px", color: "#444" }}>
          <p>
            <strong>Mode:</strong> {payment?.pay_type || "-"}
          </p>
          <p>
            <strong>Total:</strong> Rs. {payment?.amount || "0"}
          </p>
          <p>
            <strong>Collected by:</strong>{" "}
            {payment?.collected_by?.name || "Admin"}
          </p>
        </div>

        <div
          style={{
            marginTop: "20px",
            borderTop: "1px dashed #bbb",
            paddingTop: "8px",
            fontSize: "12px",
            color: "#888",
            textAlign: "center",
          }}
        >
          Customer Copy
        </div>

        <div
          style={{
            marginTop: "30px",
            borderTop: "2px solid #000",
            paddingTop: "8px",
            fontSize: "12px",
            color: "#888",
            textAlign: "center",
          }}
        >
          <p>
            <img
              src={mychitsLogo}
              alt="Company Logo"
              style={{ width: "50px", margin: "0 auto 8px", display: "block" }}
            />
          </p>
          <h2 style={{ margin: 0, fontWeight: "700" }}>MY CHITS</h2>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "#555" }}>
            No.11/36-25, 2nd Main, Kathriguppe Main Road,
            <br />
            Bangalore, 560085 | 9483900777
          </p>
          <hr style={{ borderColor: "#eee", margin: "12px 0" }} />
          <h3 style={{ margin: "8px 0" }}>Receipt</h3>

          <p>
            <strong>Receipt No:</strong>{" "}
            {payment.receipt_no ? payment.receipt_no : payment.old_receipt_no}
          </p>
          <p>
            <strong>Date:</strong> {formatPayDate(payment.pay_date)}
          </p>
          <p>
            <strong>Name:</strong> {payment?.user_id?.full_name || "-"}
          </p>
          <p>
            <strong>Mobile No:</strong> {payment?.user_id?.phone_number || "-"}
          </p>
          <p>
            <strong>Group:</strong> {payment?.group_id?.group_name || "-"}
          </p>
          <p>
            <strong>Ticket:</strong> {payment?.ticket || "-"}
          </p>

          <div
            style={{
              margin: "15px 0",
              padding: "10px",
              backgroundColor: "#f3f4f6",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "16px",
              textAlign: "center",
              border: "1px solid #ccc",
              color: "#111",
            }}
          >
            Received Amount: Rs. {payment?.amount || "0"}
          </div>

          <p>
            <strong>Mode:</strong> {payment?.pay_type || "-"}
          </p>
          <p>
            <strong>Total:</strong> Rs. {payment?.amount || "0"}
          </p>
          <p>
            <strong>Collected by:</strong>{" "}
            {payment?.collected_by?.name || "Admin"}
          </p>

          <div
            style={{
              marginTop: "20px",
              borderTop: "1px dashed #bbb",
              paddingTop: "8px",
              fontSize: "12px",
              color: "#888",
              textAlign: "center",
            }}
          >
            Office Copy
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
