import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import DiscountModal from "../components/DiscountModal";
import ReceiptModal from "../components/ReceiptModal";
import "./CashierDashboard.css";

function CashierDashboard() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isPaying, setIsPaying] = useState(false);
  const [cashierName, setCashierName] = useState("cashier1");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountData, setDiscountData] = useState({
    type: "NONE",
    label: "No Discount",
    discountAmount: 0,
    finalTotal: 0,
  });

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const parsed = JSON.parse(currentUser);
        if (parsed?.username) setCashierName(parsed.username);
      } catch {}
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
      return prev.map((i) =>
        i.id === productId ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const cancelSale = () => {
    setCart([]);
  };

  const processSale = async () => {
    if (isPaying || cart.length === 0) return;
    setIsPaying(true);

    try {
      const subtotalValue = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const discount = discountData.discountAmount || 0;
      const grandTotal = subtotalValue - discount;

      const newTransaction = {
        id: Date.now(),
        cashier: cashierName,
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
        total: grandTotal,
        subtotal: subtotalValue,
        discount,
        discountType: discountData.label,
        paymentMethod,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
      };

      // UPDATE STOCK SA API
      await Promise.all(
        cart.map((item) => {
          const product = products.find((p) => p.id === item.id);
          const newStock = product.stock - item.qty;

          return fetch(`http://127.0.0.1:8000/api/products/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: product.name,
              price: product.price,
              stock: newStock,
            }),
          });
        })
      );

      // I-REFRESH ANG PRODUCTS MULA SA API
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const updatedProducts = await res.json();
      setProducts(updatedProducts);

      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      window.dispatchEvent(new Event("pos-data-update"));

      setLastTransaction(newTransaction);
      setShowReceiptModal(true);

      setCart([]);
      setSearch("");

      setDiscountData({
        type: "NONE",
        label: "No Discount",
        discountAmount: 0,
        finalTotal: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server");
    } finally {
      setIsPaying(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discount = discountData.discountAmount || 0;
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
      <TopBar search={search} onSearchChange={setSearch} cashierName={cashierName} />

      <div className="container-fluid flex-grow-1">
        <div className="row g-3 py-3 cashier-body">

          {/* SIDEBAR */}
          <div className="col-12 col-xl-1">
            <div className="cashier-icon-rail">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`cashier-icon-btn ${activeCategory === c.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <div>{c.icon}</div>
                  <div className="small">{c.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="col-12 col-xl-8">
            <div className="row g-3">
              {filteredProducts.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <button
                    className="cashier-product-card"
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                  >
                    <div className="cashier-product-img">🛍️</div>
                    <div>{p.name}</div>
                    <div>₱{Number(p.price).toFixed(2)}</div>

                    {/* STOCK INDICATOR */}
                    {p.stock === 0 ? (
                      <span className="badge bg-danger mt-1">Out of Stock</span>
                    ) : p.stock <= 5 ? (
                      <span className="badge bg-warning text-dark mt-1">Low Stock ({p.stock})</span>
                    ) : (
                      <span className="badge bg-success mt-1">In Stock ({p.stock})</span>
                    )}

                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER */}
          <div className="col-12 col-xl-3">
            <div className="card p-3">

              {cart.map((item) => (
                <div key={item.id} className="mb-2">
                  <div>{item.name}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <button onClick={() => decrementQty(item.id)}>-</button>
                      <span className="mx-2">{item.qty}</span>
                      <button onClick={() => incrementQty(item.id)}>+</button>
                    </div>
                    <div>₱{(item.price * item.qty).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                </div>
              ))}

              <hr />

              <div>Subtotal: ₱{subtotal.toFixed(2)}</div>
              <div className="text-success">
                Discount: -₱{discount.toFixed(2)}
              </div>
              <div className="fw-bold">
                Total: ₱{grandTotal.toFixed(2)}
              </div>

              <div className="mt-3">
                {["CASH", "CARD", "QR"].map((m) => (
                  <button
                    key={m}
                    className={`btn me-2 ${
                      paymentMethod === m ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => setShowDiscountModal(true)}
              >
                CHECKOUT
              </button>

              <button
                className="btn btn-link text-danger w-100 mt-2"
                onClick={cancelSale}
              >
                Cancel Sale
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* DISCOUNT MODAL */}
      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        subtotal={subtotal}
        currentUser={{ role: "cashier", username: cashierName }}
        onApply={(data) => {
          setDiscountData(data);
          setShowDiscountModal(false);
          processSale();
        }}
      />

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        transaction={lastTransaction}
      />
    </div>
  );
}

export default CashierDashboard;