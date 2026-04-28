import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const openAddModal = () => {
    setEditProduct(null);
    setName("");
    setPrice("");
    setStock("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setShowModal(true);
  };

  const saveProduct = async () => {
    if (!name || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editProduct) {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${editProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price: Number(price), stock: Number(stock) }),
        });
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch("http://127.0.0.1:8000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price: Number(price), stock: Number(stock) }),
        });
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
      }

      setName("");
      setPrice("");
      setStock("");
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server");
    }
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>Product Management</h3>
          <button className="btn btn-success" onClick={openAddModal}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>₱{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteTarget(product)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No products yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content overflow-hidden">
                <div className="modal-header border-0 text-white" style={{ background: "#198754" }}>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      {editProduct ? "Edit Product" : "Add Product"}
                    </h5>
                    <small style={{ opacity: 0.85 }}>Fill in the details below</small>
                  </div>
                  <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-success" onClick={saveProduct}>
                    {editProduct ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content overflow-hidden">
                <div className="modal-header border-0 text-white" style={{ background: "#dc3545" }}>
                  <h5 className="modal-title fw-bold mb-0">Delete Product</h5>
                  <button className="btn-close btn-close-white" onClick={() => setDeleteTarget(null)} />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
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