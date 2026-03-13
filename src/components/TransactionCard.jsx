function TransactionCard({ cart, subtotal, cancelSale }) {
  return (
    <div className="col-md-4 border-start p-4 d-flex flex-column">

      <h5 className="mb-3">Transaction</h5>

      {/* CART ITEMS */}
      <div
        className="flex-grow-1 border rounded p-3 mb-3"
        style={{ overflowY: "auto", maxHeight: "400px" }}
      >
        {cart.length === 0 ? (
          <p className="text-muted text-center mt-5">
            No items added
          </p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between border-bottom py-2"
            >
              <span>{item.name}</span>
              <span>₱{item.price}</span>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}
      <div className="border-top pt-3 mb-3">

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <strong>₱{subtotal}</strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Discount</span>
          <span>₱0</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fs-5">
          <strong>Total</strong>
          <strong className="text-success">₱{subtotal}</strong>
        </div>

      </div>

      {/* BUTTONS */}
      <button className="btn btn-outline-secondary mb-2">
        Apply Discount
      </button>

      <button
        className="btn btn-outline-danger mb-2"
        onClick={cancelSale}
      >
        Cancel Sale
      </button>

      <button className="btn btn-dark fw-bold">
        Pay
      </button>

    </div>
  );
}

export default TransactionCard;