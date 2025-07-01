import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CartItemCard from "../components/CartItemCard";

interface ItemData {
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  productId: number;
  quantity: number;
}

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  type ItemMap = { [productId: number]: ItemData };
  const [items, setItems] = useState<ItemMap>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const totalPrice = cart.reduce((sum, cartItem) => {
    const item = items[cartItem.productId];
    if (!item) return sum;
    return sum + item.price * cartItem.quantity;
  }, 0);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    setUnsavedChanges(true); // set a flag to tell that values has been changed
  };

  const handleRemove = (productId: number) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    setUnsavedChanges(true); // set a flag to tell that values has been changed
  };

  const saveCart = async () => {
    if (user) {
      await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    }

    setUnsavedChanges(false);
  };

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Fetch user's cart from JSON DB
        const request = `http://localhost:8000/users/${user.id}`;
        const res = await fetch(request);
        const userData = await res.json();
        setCart(userData.cart || []);
      } else {
        // Load guest cart from localStorage
        const guestCart = JSON.parse(
          localStorage.getItem("guest_cart") || "[]"
        );
        setCart(guestCart);
      }
    };

    loadCart();
  }, [user]);

  useEffect(() => {
    const fetchAllItems = async () => {
      const fetchedEntries = await Promise.all(
        cart.map(async (cartItem) => {
          const res = await fetch(
            `http://localhost:8000/items/${cartItem.productId}`
          );
          const data = await res.json();
          return [cartItem.productId, data];
        })
      );

      setItems(Object.fromEntries(fetchedEntries));
    };

    if (cart.length > 0) fetchAllItems();
  }, [cart]);

  return (
    <div className="p-4 text-center background1 flex flex-col max-h-fit">
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {cart.map((cartItem) => {
            const item = items[cartItem.productId];
            return item ? (
              <CartItemCard
                key={cartItem.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                productId={cartItem.productId}
                quantity={cartItem.quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ) : (
              <img
                className="justify-self-center "
                src="src/assets/loading.webp"
                alt="LOADING..."
              />
            );
          })}
        </div>
      )}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded px-4 py-3 text-right">
        <p className="text-lg dark:text-black font-semibold">
          Total: ${totalPrice.toFixed(2)}
        </p>
      </div>
      {unsavedChanges && (
        <div className="fixed bottom-4  bg-blue-600 text-white px-4 py-3 rounded shadow-md z-50">
          <p className="mb-2">You have unsaved changes.</p>
          <button
            onClick={saveCart}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            Save Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
