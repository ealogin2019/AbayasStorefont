import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { items, updateQty, remove, total } = useCart();
  const navigate = useNavigate();

  if (!items.length)
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-display">Your bag is empty</h2>
        <p className="mt-4 text-muted-foreground">
          Discover our collection and add your favorite abayas to your bag.
        </p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      <h1 className="font-display text-2xl md:text-3xl lg:text-4xl">Your Bag</h1>
      <div className="mt-6 md:mt-8 grid gap-6 md:gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul className="space-y-3 md:space-y-4">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-start gap-3 md:gap-4 rounded-md border p-3 md:p-4"
              >
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm md:text-base truncate">{it.name}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {it.size ?? "-"}
                      </div>
                    </div>
                    <div className="font-semibold text-sm md:text-base">
                      {it.currency} {it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        updateQty(it.id, Math.max(1, Number(e.target.value)))
                      }
                      className="w-20 rounded-md border px-2 py-1"
                    />
                    <button
                      onClick={() => remove(it.id)}
                      className="text-sm text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="rounded-md border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="font-semibold">AED {total.toFixed(2)}</div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground italic">
            Complimentary shipping & signature gift wrap included
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full rounded-md bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Proceed to Checkout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
