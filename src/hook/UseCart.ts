import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ItemData {
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

const UseCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]); // Initialize with an empty array
  type ItemMap = { [productId: number]: ItemData };
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [listOfItems, setListOfItems] = useState<ItemMap>({});

  const totalPrice = cart.reduce((sum, cartItem) => {
    const item = listOfItems[cartItem.productId];
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
    const initCart = async () => {
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
    console.log("initCart Called");
    initCart(); // Call the function only once when the component mounts
  }, [user]); // Dependency on `user` ensures it runs when `user` changes

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

      setListOfItems(Object.fromEntries(fetchedEntries));
    };

    if (cart.length > 0) fetchAllItems();
  }, [cart]);

  return {
    cart,
    listOfItems,
    totalPrice,
    unsavedChanges,
    handleQuantityChange,
    handleRemove,
    saveCart,
  };
};

export default UseCart;
