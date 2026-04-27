import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import users from "./data/users";
import products from "./data/products";
import transactions from "./data/transactions";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(products));
    }
    if (!localStorage.getItem("transactions")) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;