import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import CartPage from "../pages/CartPage.tsx";
import ShopPage from "../pages/ShopPage.tsx";
import Header from "../components/Header.tsx";
import { AuthProvider } from "../context/AuthContext.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
