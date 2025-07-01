import { useState } from "react";

interface CartItemCardProps {
  name: string;
  price: number;
  image: string;
  productId: number;
  quantity: number;
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItemCard = ({
  name,
  price,
  image,
  productId,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) => {
  const [inputQty, setInputQty] = useState(quantity);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setInputQty(val);

      if (val === 0) {
        const confirm = window.confirm(
          "Quantity is 0. Do you want to remove this item from the cart?"
        );
        if (confirm) {
          onRemove(productId);
        } else {
          setInputQty(1);
          onQuantityChange(productId, 1);
        }
      } else {
        onQuantityChange(productId, val);
      }
    }
  };

  const adjustQuantity = (delta: number) => {
    const newQty = inputQty + delta;
    if (newQty <= 0) {
      const confirm = window.confirm(
        "Do you want to remove this item from the cart?"
      );
      if (confirm) {
        onRemove(productId);
      }
      return;
    }
    setInputQty(newQty);
    onQuantityChange(productId, newQty);
  };

  return (
    <div key={`${productId}`} className="p-4 border rounded shadow-sm">
      <p className="font-semibold">{name}</p>
      <img
        src={image}
        alt={`item_id:${productId}`}
        className="mx-auto max-w-[200px]"
      />
      <p>Price: ${price}</p>
      <p>Product ID: {productId}</p>

      <div className="flex items-center justify-center space-x-2 mt-2">
        <button
          onClick={() => adjustQuantity(-1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:text-black"
        >
          −
        </button>

        <input
          type="number"
          value={inputQty}
          onChange={handleInputChange}
          className="w-16 text-center border border-gray-300 rounded"
          min={0}
        />

        <button
          onClick={() => adjustQuantity(1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:text-black"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
