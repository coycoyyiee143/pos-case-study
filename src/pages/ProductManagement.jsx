import { useState, useEffect } from "react";
import productsData from "../data/products";
import AdminSidebar from "../components/AdminSidebar";

function ProductManagement() {

  // LOAD FROM LOCAL STORAGE FIRST
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : productsData;
  });

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // AUTO SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    window.dispatchEvent(new Event("pos-data-update"));
  }, [products]);

  const addProduct = () => {
    if (!name || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      stock: Number(stock),
    };

    setProducts((prev) => [...prev, newProduct]);

    setName("");
    setPrice("");
    setStock("");
    setShowModal(false);
  };

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <div className="d-flex justify-content-between mb-3">
          <h3>Product Management</h3>

          <button
            className="btn btn-dark"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        </div>

        <div className="card shadow-sm">
          <table className="table mb-0">

            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>₱{product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* ADD PRODUCT MODAL */}
        {showModal && (
          <div
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Add Product</h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">

                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-dark"
                    onClick={addProduct}
                  >
                    Add Product
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductManagement;