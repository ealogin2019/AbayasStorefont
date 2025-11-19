import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Checkout() {
  const { items, clear, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return toast.error("Cart is empty");
    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "Customer";
      
      const res = await api.createCheckout({
        email,
        firstName,
        lastName,
        address,
        city: "Dubai",
        country: "UAE",
        zipCode: "00000",
        phone: "+971",
        shippingCost: 0,
        tax: 0,
      });
      toast.success("Order created: " + res.order.orderNumber);
      clear();
      navigate(`/`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
  <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <form className="md:col-span-2" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <div className="text-sm">Name</div>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <label>
              <div className="text-sm">Email</div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <div className="text-sm">Shipping address</div>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>

          <div className="mt-2 text-xs text-muted-foreground italic">
            Complimentary shipping & signature gift wrap included
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-6 py-3 text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              {loading ? "Processing…" : `Pay AED ${total.toFixed(2)}`}
            </button>
          </div>
        </form>

        <aside className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between">
                <div className="text-sm">
                  {it.name} × {it.qty}
                </div>
                <div className="font-medium">
                  AED {(it.price * it.qty).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-semibold">AED {total.toFixed(2)}</div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground italic text-center">
            Free worldwide shipping & luxury packaging
          </div>
        </aside>
      </div>
    </div>
  );
}
