import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

export interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
interface CartItem {
  productId: number;
  quantity: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (user: User) => {
    // 1. Load user data from DB
    const res = await fetch(`http://localhost:8000/users/${user.id}`);
    const dbUser = await res.json();

    // 2. Load guest cart
    const guestCart: CartItem[] = JSON.parse(
      localStorage.getItem("guest_cart") || "[]"
    );

    // 3. Merge carts
    const userCart = dbUser.cart || [];
    const mergedCart: CartItem[] = [...userCart];

    guestCart.forEach((guestItem) => {
      const existing = mergedCart.find(
        (item) => item.productId === guestItem.productId
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        mergedCart.push({ ...guestItem });
      }
    });

    // 4. Update user in DB
    await fetch(`http://localhost:8000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: mergedCart }),
    });

    // 5. Save to context & localStorage
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    // 6. Clear guest cart
    localStorage.removeItem("guest_cart");
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
