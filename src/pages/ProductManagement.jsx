import { useState, useEffect } from "react";
import productsData from "../data/products";
import AdminSidebar from "../components/AdminSidebar";

function ProductManagement() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : productsData;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Add or Save product
  const saveProduct = () => {
    // Require all fields including barcode
    if (!name || !price || !stock || !barcode) {
      alert("Please fill all fields including barcode");
      return;
    }

    if (editingId) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? { ...product, name, barcode, price: Number(price), stock: Number(stock) }
            : product
        )
      );
      setEditingId(null);
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name,
        barcode,
        price: Number(price),
        stock: Number(stock),
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    // Reset modal fields
    setName("");
    setPrice("");
    setStock("");
    setBarcode("");
    setShowModal(false);
  };

  // Delete product
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // Edit product
  const editProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setBarcode(product.barcode);
    setEditingId(id);
    setShowModal(true);
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>Product Management</h3>
          <button className="btn btn-dark" onClick={() => setShowModal(true)}>
            Add Product
          </button>
        </div>

        <div className="card shadow-sm">
          <table className="table mb-0">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Barcode</th>
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
                    <td>{product.barcode}</td>
                    <td>₱{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => editProduct(product.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD / EDIT PRODUCT MODAL */}
        {showModal && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? "Edit Product" : "Add Product"}
                  </h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
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
                    <label className="form-label">Barcode</label>
                    <input
                      className="form-control"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Enter barcode manually"
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
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-dark" onClick={saveProduct}>
                    {editingId ? "Save Changes" : "Add Product"}
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