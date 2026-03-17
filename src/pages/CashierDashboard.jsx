import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import TransactionCard from "../components/TransactionCard";

function CashierDashboard() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Cancel sale
  const cancelSale = () => {
    setCart([]);
    setBarcodeInput("");
  };

  // Add product by barcode
  const handleBarcodeAdd = () => {
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      alert("Product not found!");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <TopBar />

      <div className="row flex-grow-1">

        {/* PRODUCTS */}
        <div className="col-md-8 p-4 bg-light">

          <input
            className="form-control mb-3"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Barcode input */}
          <div className="input-group mb-4">
            <input
              className="form-control"
              placeholder="Enter barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button
              className="btn btn-dark"
              onClick={handleBarcodeAdd}
            >
              Add by Barcode
            </button>
          </div>

          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="col-md-3 mb-3" key={product.id}>
                  <div
                    className="border rounded p-3 text-center bg-white shadow-sm h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => addToCart(product)}
                  >
                    <div className="fw-semibold">{product.name}</div>
                    <small className="d-block text-muted">₱{product.price}</small>
                    <small className="text-muted">Barcode:<small className="text-muted">Barcode: {product.barcode}</small> {product.barcode}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>

        </div>

        {/* TRANSACTION */}
        <TransactionCard
          cart={cart}
          subtotal={subtotal}
          cancelSale={cancelSale}
        />

      </div>
    </div>
  );
}

export default CashierDashboard;