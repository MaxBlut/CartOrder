import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ItemData {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  productId: number;
  quantity: number;
}

const ShopPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ItemData[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch all items from the database
  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("http://localhost:8000/items");
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  // Load cart based on user status
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const res = await fetch(`http://localhost:8000/users/${user.id}`);
        const userData = await res.json();
        setCart(userData.cart || []);
      } else {
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]"
        );
        setCart(guestCart);
      }
    };
    loadCart();
  }, [user?.id]);

  // Save updated cart to appropriate place
  const saveCart = async (updatedCart: CartItem[]) => {
    setCart(updatedCart);

    if (user) {
      await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
      console.log(user);
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };

  // Add item to cart (or increase quantity)
  const handleAddToCart = (event: any, productId: number) => {
    event.preventDefault();
    console.log(productId);
    const existing = cart.find((item) => item.productId === productId);
    let updatedCart: CartItem[];

    if (existing) {
      updatedCart = cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { productId, quantity: 1 }];
    }

    saveCart(updatedCart);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Shop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow">
            {item ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover mb-4"
              />
            ) : (
              <img
                className="justify-self-center "
                src="src/assets/loading.webp"
                alt="LOADING..."
              />
            )}
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-700">${item.price}</p>
            <button
              onClick={(event) => handleAddToCart(event, item.id)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
