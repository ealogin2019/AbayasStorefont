import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendContact({ name, email, message });
      toast.success(res.message ?? "Message sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28">
      <div className="container py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-2">\n        <div>
          <h1 className="font-display text-3xl md:text-4xl">Contact Arab Abayas</h1>
          <p className="mt-4 text-muted-foreground">
            For questions about our abayas, your order, or bespoke services, please send us a message. Our team will respond within 1-2 business days.
          </p>

          <form className="mt-8 max-w-md" onSubmit={submit}>
            <label className="block">
              <span className="text-sm">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm">Message</span>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </label>
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-md bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="font-display text-xl">Contact Details</h2>
          <p className="mt-3 text-muted-foreground">
            Email: hello@arababayas.example
          </p>
          <p className="mt-1 text-muted-foreground">Phone: +971 55 000 0000</p>

          <div className="mt-6 rounded-xl border overflow-hidden bg-card">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200"
              alt="Store"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
