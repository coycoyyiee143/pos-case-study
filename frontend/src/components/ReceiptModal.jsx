import React, { useRef, useState } from "react";

const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  const printRef = useRef();
  const [copies, setCopies] = useState(1);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    const contents = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=400,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Receipt - ${transaction.id}</title>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              width: 300px;
              margin: 0 auto;
              padding: 16px;
            }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .big { font-size: 14px; }
          </style>
        </head>
        <body>${contents}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      for (let i = 0; i < copies; i++) win.print();
      win.close();
    }, 300);
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Transaction Complete</h5>
              <span className="badge bg-success ms-2">PAID</span>
            </div>

            <div className="modal-body">
              {/* Receipt Preview */}
              <div
                ref={printRef}
                style={{
                  background: "#fafafa",
                  border: "1px dashed #ccc",
                  borderRadius: 8,
                  padding: "16px 14px",
                  fontFamily: "monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                }}
              >
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14 }}>
                   SariPh Retail Store
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#666", marginBottom: 6 }}>
                  321 Main St, Manila
                </div>

                <div className="divider" style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>TXN#:</span>
                  <span>{transaction.id}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Date:</span>
                  <span>{transaction.date}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cashier:</span>
                  <span>{transaction.cashier}</span>
                </div>

                <div style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                {transaction.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ flex: 1 }}>{item.name} x{item.qty}</span>
                    <span>₱{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>₱{Number(transaction.subtotal).toFixed(2)}</span>
                </div>

                {transaction.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "green" }}>
                    <span>Discount ({transaction.discountType}):</span>
                    <span>-₱{Number(transaction.discount).toFixed(2)}</span>
                  </div>
                )}

                <div style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}>
                  <span>TOTAL:</span>
                  <span>₱{Number(transaction.total).toFixed(2)}</span>
                </div>

                <div style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment:</span>
                  <span>{transaction.paymentMethod}</span>
                </div>

                {transaction.cashTendered > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Cash Tendered:</span>
                      <span>₱{Number(transaction.cashTendered).toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                      <span>Change:</span>
                      <span>₱{Number(transaction.change).toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div style={{ borderTop: "1px dashed #aaa", margin: "6px 0" }} />

                <div style={{ textAlign: "center", fontSize: 11, marginTop: 4 }}>
                  Thank you for your purchase!
                </div>
                <div style={{ textAlign: "center", fontSize: 10, color: "#999" }}>
                  Please come again!
                </div>
              </div>

              {/* Copies input */}
              <div className="d-flex align-items-center gap-2 mt-3">
                <label className="small fw-bold text-muted mb-0">Copies:</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={copies}
                  onChange={(e) =>
                    setCopies(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))
                  }
                  style={{ width: 64, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}
                />
              </div>
            </div>

            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={onClose}>
                New Sale
              </button>
              <button className="btn btn-primary px-4" onClick={handlePrint}>
                🖨️ Print Receipt
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptModal;
