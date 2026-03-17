function TransactionCard({
  cart,
  subtotal,
  cancelSale,
  processSale,
  removeFromCart,
  isPaying = false,
}) {
  return (
    <div className="col-md-4 border-start p-0 d-flex flex-column bg-white">

      <div className="p-4 pb-3 border-bottom bg-white sticky-top">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">Transaction</h5>
          <span className="badge text-bg-secondary">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>
        <small className="text-muted d-block mt-1">Review items before payment</small>
      </div>

      {/* CART ITEMS */}
      <div
        className="flex-grow-1 p-3"
        style={{ overflowY: "auto" }}
      >
        {cart.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <div className="fs-1 mb-2">🛒</div>
            <div className="fw-semibold">No items added</div>
            <div className="small">Tap a product to add it to the cart</div>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <div>
                <div className="fw-semibold">{item.name}</div>
                <small className="text-muted">
                  ₱{item.price} × {item.qty}
                </small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold">₱{(item.price * item.qty).toFixed(2)}</span>
                <button
                  className="btn btn-sm btn-outline-danger py-0 px-1"
                  style={{ lineHeight: 1.2, fontSize: 12 }}
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                  disabled={isPaying}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}
      <div className="border-top p-4 pt-3">

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <strong>₱{subtotal.toFixed(2)}</strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Discount</span>
          <span>₱0.00</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fs-5">
          <strong>Total</strong>
          <strong className="text-success">₱{subtotal.toFixed(2)}</strong>
        </div>

        {/* BUTTONS */}
        <div className="d-grid gap-2 mt-3">
          <button
            className="btn btn-outline-danger"
            onClick={cancelSale}
            disabled={cart.length === 0 || isPaying}
          >
            Cancel Sale
          </button>

          <button
            className="btn btn-dark fw-bold"
            onClick={processSale}
            disabled={cart.length === 0 || isPaying}
          >
            {isPaying ? "Processing…" : `💰 Pay ₱${subtotal.toFixed(2)}`}
          </button>
        </div>

      </div>

    </div>
  );
}

export default TransactionCard;