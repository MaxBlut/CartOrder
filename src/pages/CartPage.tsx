import CartItemCard from "../components/CartItemCard";
import UseCart, { type CartItem } from "../hook/UseCart";

const CartPage = () => {
  const {
    cart,
    listOfItems,
    totalPrice,
    unsavedChanges,
    handleQuantityChange,
    handleRemove,
    saveCart,
  } = UseCart();
  return (
    <div className="p-4 text-center background1 flex flex-col max-h-fit">
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {cart.map((cartItem: CartItem) => {
            const item = listOfItems[cartItem.productId];
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
                key={"img" + cartItem.productId}
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
