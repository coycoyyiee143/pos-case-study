import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import "./CashierDashboard.css";

function CashierDashboard() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isPaying, setIsPaying] = useState(false);
  const [cashierName, setCashierName] = useState("cashier1");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        if (parsed?.username) setCashierName(parsed.username);
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const incrementQty = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrementQty = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;
      if (item.qty <= 1) return prev.filter((i) => i.id !== productId);
      return prev.map((i) => (i.id === productId ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const cancelSale = () => {
    setCart([]);
  };

  const processSale = () => {
    if (isPaying || cart.length === 0) return;
    setIsPaying(true);

    try {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      const subtotalValue = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const discount = 0;
      const grandTotal = subtotalValue - discount;

      const newTransaction = {
        id: Date.now(),
        cashier: cashierName,
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
        total: grandTotal,
        subtotal: subtotalValue,
        discount,
        paymentMethod,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
      };

      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      // Notify admin dashboard to refresh
      window.dispatchEvent(new Event("pos-data-update"));

      alert(`Payment successful!\nTotal: ₱${newTransaction.total.toFixed(2)}`);
      setCart([]);
      setSearch("");
    } finally {
      setIsPaying(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 0;
  const grandTotal = subtotal - discount;

  const categories = [
    { id: "ALL", label: "All", icon: "▦" },
    { id: "GENERAL", label: "General", icon: "🧺" },
    { id: "DRINKS", label: "Drinks", icon: "🥤" },
    { id: "FOOD", label: "Food", icon: "🍞" },
  ];

  const getCategoryForProduct = (product) => {
    const name = String(product?.name ?? "").toLowerCase();
    if (name.includes("tang")) return "FOOD";
    if (name.includes("coke") || name.includes("juice") || name.includes("water")) return "DRINKS";
    if (name.includes("bread") || name.includes("pancit") || name.includes("noodle")) return "FOOD";
    return "GENERAL";
  };

  const filteredProducts = products
    .map((p) => ({ ...p, category: getCategoryForProduct(p) }))
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "ALL" ? true : product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="cashier-page">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        cashierName={cashierName}
      />

      <div className="container-fluid flex-grow-1">
        <div className="row g-3 py-3 cashier-body">
          {/* LEFT ICON SIDEBAR */}
          <div className="col-12 col-xl-1">
            <div className="cashier-icon-rail">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`cashier-icon-btn ${activeCategory === c.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <div className="cashier-icon">{c.icon}</div>
                  <div className="cashier-icon-label">{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE PRODUCTS GRID */}
          <div className="col-12 col-xl-8">
            <div className="cashier-products card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <div className="text-muted small">Menu / Products</div>
                    <div className="fw-bold"> </div>
                  </div>
                  <button type="button" className="btn btn-light border btn-sm" disabled>
                    Filter
                  </button>
                </div>

                <div className="row g-3">
                  {filteredProducts.length === 0 ? (
                    <div className="col-12 text-center text-muted py-5">
                      No products found.
                    </div>
                  ) : (
                    filteredProducts.map((p) => (
                      <div key={p.id} className="col-6 col-md-4 col-lg-3">
                        <button
                          type="button"
                          className="cashier-product-card"
                          onClick={() => addToCart(p)}
                          disabled={isPaying}
                        >
                          <div className="cashier-product-img" aria-hidden="true">
                            <span className="cashier-product-img-icon">🛍️</span>
                          </div>
                          <div className="cashier-product-name">{p.name}</div>
                          <div className="cashier-product-meta">
                            <span className="text-muted small">
                              {p.category === "GENERAL" ? "Product" : p.category.toLowerCase()}
                            </span>
                            <span className="cashier-product-price">₱{Number(p.price).toFixed(2)}</span>
                          </div>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CURRENT ORDER */}
          <div className="col-12 col-xl-3">
            <div className="card border-0 shadow-sm cashier-order">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold">Current Order</div>
                    <div className="text-muted small">{cart.length} items in basket</div>
                  </div>
                  <span className="badge text-bg-light border">
                    #{Date.now().toString().slice(-6)}
                  </span>
                </div>

                <div className="cashier-order-items mt-3">
                  {cart.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      No items yet.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="cashier-order-item">
                        <div className="cashier-order-item-main">
                          <div className="cashier-order-item-name">{item.name}</div>
                        </div>

                        <div className="cashier-order-item-controls">
                          <div className="btn-group btn-group-sm" role="group" aria-label="Quantity">
                            <button
                              type="button"
                              className="btn btn-light border"
                              onClick={() => decrementQty(item.id)}
                              disabled={isPaying}
                            >
                              −
                            </button>
                            <button type="button" className="btn btn-light border" disabled>
                              {item.qty}
                            </button>
                            <button
                              type="button"
                              className="btn btn-light border"
                              onClick={() => incrementQty(item.id)}
                              disabled={isPaying}
                            >
                              +
                            </button>
                          </div>
                          <div className="cashier-order-item-price">₱{(item.price * item.qty).toFixed(2)}</div>
                          <button
                            type="button"
                            className="btn btn-link text-muted p-0 cashier-order-remove"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isPaying}
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="cashier-order-summary mt-3">
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="fw-semibold">Grand Total</div>
                    <div className="fs-3 fw-bold text-primary">₱{grandTotal.toFixed(2)}</div>
                  </div>
                </div>

                <div className="text-muted small fw-semibold mt-4 mb-2">
                  SELECT PAYMENT METHOD
                </div>
                <div className="row g-2">
                  {[
                    { id: "CASH", label: "CASH" },
                    { id: "CARD", label: "CARD" },
                    { id: "QR", label: "QR PAY" },
                  ].map((m) => (
                    <div className="col-4" key={m.id}>
                      <button
                        type="button"
                        className={`btn w-100 cashier-pay-method ${
                          paymentMethod === m.id ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod(m.id)}
                        disabled={isPaying}
                      >
                        <span className="small fw-bold">{m.label}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3 py-3 fw-bold"
                  onClick={processSale}
                  disabled={cart.length === 0 || isPaying}
                >
                  {isPaying ? "CHECKOUT…" : "CHECKOUT"}
                </button>

                <div className="d-flex gap-2 mt-2">
                  <button type="button" className="btn btn-light border w-100" disabled>
                    HOLD (F8)
                  </button>
                  <button type="button" className="btn btn-light border w-100" disabled>
                    REFUND
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-link w-100 text-danger mt-2"
                  onClick={cancelSale}
                  disabled={cart.length === 0 || isPaying}
                >
                  Cancel Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;