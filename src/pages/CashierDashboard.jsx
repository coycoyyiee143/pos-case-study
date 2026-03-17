import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import TransactionCard from "../components/TransactionCard";

function CashierDashboard() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const cancelSale = () => {
    setCart([]);
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
            className="form-control mb-4"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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
                    <small className="text-muted">
                      ₱{product.price}
                    </small>
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