import React, { useState } from "react";
import { DISCOUNT_TYPES, calculateDiscount } from "../data/discount";

const DiscountModal = ({ isOpen, onClose, subtotal, currentUser, onApply }) => {
  const [selectedDiscount, setSelectedDiscount] = useState("NONE");

  const isAuthorized =
    currentUser?.role === "cashier" || currentUser?.role === "admin";

  if (!isOpen) return null;

  const result = calculateDiscount(subtotal, selectedDiscount);

  const handleApply = () => {
    onApply({
      type: selectedDiscount,
      label: DISCOUNT_TYPES[selectedDiscount].label,
      ...result,
    });
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>

      {/* MODAL */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Apply Discount</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {!isAuthorized ? (
                <div className="alert alert-danger">
                  <strong>Access Restricted</strong>
                  <div className="small">
                    Only Cashier/Admin can apply discounts.
                  </div>
                </div>
              ) : (
                <div className="card border-0 bg-light">
                  <div className="card-body">

                    {/* SELECT */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">
                        Select Discount Type
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={selectedDiscount}
                        onChange={(e) => setSelectedDiscount(e.target.value)}
                      >
                        {Object.keys(DISCOUNT_TYPES).map((key) => (
                          <option key={key} value={key}>
                            {DISCOUNT_TYPES[key].label}
                            {DISCOUNT_TYPES[key].value > 0
                              ? ` (${DISCOUNT_TYPES[key].value * 100}%)`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-4 p-3 bg-white rounded shadow-sm">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Subtotal:</span>
                        <span className="fw-bold">
                          ₱{subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between small text-success">
                        <span>Discount:</span>
                        <span className="fw-bold">
                          -₱{result.discountAmount.toFixed(2)}
                        </span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Total:</span>
                        <span className="fw-bold text-primary fs-5">
                          ₱{result.finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>

              {isAuthorized && (
                <button
                  className="btn btn-primary px-4"
                  onClick={handleApply}
                >
                  Apply Discount
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountModal;