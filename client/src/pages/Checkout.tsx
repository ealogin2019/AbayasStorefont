import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Checkbox } from "@/ui/checkbox";

export default function Checkout() {
  const { items, clear, total } = useCart();
  const { isAuthenticated, customer } = useCustomerAuth();
  const [contactEmail, setContactEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("UAE");
  const [zipCode, setZipCode] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const shippingCost = 25.0;

  // Pre-fill form if customer is authenticated
  useEffect(() => {
    if (isAuthenticated && customer) {
      setContactEmail(customer.email || "");
      setFirstName(customer.firstName || "");
      setLastName(customer.lastName || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setAddress(customer.address || "");
      setCity(customer.city || "");
      setCountry(customer.country || "UAE");
      setZipCode(customer.zipCode || "");
      setNameOnCard(
        `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
      );
    }
  }, [isAuthenticated, customer]);

  const handleApplyDiscount = () => {
    if (discountCode) {
      toast.info("Discount code feature coming soon");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await api.checkout({
        email: contactEmail || email,
        firstName,
        lastName,
        address: apartment ? `${address}, ${apartment}` : address,
        city,
        postalCode: zipCode,
        country,
        paymentMethod: paymentMethod as "cod" | "card",
      });
      toast.success(`Order ${res.orderNumber} created successfully!`);
      clear();
      navigate(`/payment-success?order=${res.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-[#8B4513] hover:bg-[#723A0F] text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Checkout Form */}
          <div className="lg:pr-8">
            <div className="mb-8">
              <Link
                to="/"
                className="text-2xl font-serif font-semibold text-[#B8860B]"
              >
                Arab Abayas
              </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Express Checkout */}
              <div>
                <h3 className="text-sm font-medium mb-3">Express checkout</h3>
                <Button
                  type="button"
                  className="w-full bg-black hover:bg-gray-900 text-white h-12 rounded-md font-medium"
                  onClick={() => toast.info("Express checkout coming soon")}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.53 5.17c-.95-1.15-2.5-1.88-4.22-1.88-2.98 0-5.4 2.42-5.4 5.4 0 1.17.38 2.26 1.02 3.14.09.12.19.24.29.35l7.31 7.31 7.31-7.31c.1-.11.2-.23.29-.35.64-.88 1.02-1.97 1.02-3.14 0-2.98-2.42-5.4-5.4-5.4-1.72 0-3.27.73-4.22 1.88z" />
                  </svg>
                  G Pay
                </Button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Contact</h3>
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="text-sm text-[#8B4513] hover:underline"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
                <Input
                  type="email"
                  placeholder="Email or mobile phone number"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full"
                />
                {!isAuthenticated && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox id="emailOffers" />
                    <label
                      htmlFor="emailOffers"
                      className="text-sm text-gray-600"
                    >
                      Email me with news and offers
                    </label>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div>
                <h3 className="text-sm font-medium mb-3">Delivery</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="country" className="text-sm">
                      Country/Region
                    </Label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full mt-1.5 h-11 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="UAE">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <Input
                    placeholder="Apartment, suite, etc. (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Postal code (optional)"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  {!isAuthenticated && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={saveInfo}
                        onCheckedChange={(checked) =>
                          setSaveInfo(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="saveInfo"
                        className="text-sm text-gray-600"
                      >
                        Save this information for next time
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h3 className="text-sm font-medium mb-3">Shipping method</h3>
                <div className="border rounded-md p-4 flex items-center justify-between bg-blue-50 border-[#8B4513]">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="standard"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="standard" className="text-sm font-medium">
                      Standard
                    </label>
                  </div>
                  <span className="text-sm font-medium">
                    AED {shippingCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="text-sm font-medium mb-3">Payment</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  All transactions are secure and encrypted.
                </p>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 border-b border-[#8B4513] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="card"
                          name="payment"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="card" className="text-sm font-medium">
                          Credit card
                        </label>
                      </div>
                      <div className="flex space-x-1">
                        <svg
                          className="w-8 h-6"
                          viewBox="0 0 32 20"
                          fill="none"
                        >
                          <rect width="32" height="20" rx="2" fill="#1434CB" />
                          <path
                            d="M13.8 6.4h4.4v7.2h-4.4V6.4z"
                            fill="#FF5F00"
                          />
                          <path
                            d="M14.2 10c0-1.44.68-2.72 1.74-3.54A4.49 4.49 0 0 0 13.2 5.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c1.08 0 2.06-.38 2.83-.96A4.47 4.47 0 0 1 14.2 10z"
                            fill="#EB001B"
                          />
                          <path
                            d="M23.2 10c0 2.48-2.02 4.5-4.5 4.5a4.49 4.49 0 0 1-2.83-.96A4.48 4.48 0 0 0 17.8 10c0-1.44-.68-2.72-1.74-3.54A4.49 4.49 0 0 1 18.7 5.5c2.48 0 4.5 2.02 4.5 4.5z"
                            fill="#F79E1B"
                          />
                        </svg>
                        <svg
                          className="w-8 h-6"
                          viewBox="0 0 32 20"
                          fill="none"
                        >
                          <rect width="32" height="20" rx="2" fill="#016FD0" />
                          <path
                            d="M16 14.5l-4-9h2.5l2.5 6.5 2.5-6.5h2.5l-4 9h-2z"
                            fill="white"
                          />
                        </svg>
                        <svg
                          className="w-8 h-6"
                          viewBox="0 0 32 20"
                          fill="none"
                        >
                          <rect width="32" height="20" rx="2" fill="#006FCF" />
                          <path
                            d="M13.5 13.5h5v1h-5v-1zm0-3h5v1h-5v-1z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="p-4 space-y-4 bg-gray-50">
                      <Input
                        placeholder="Card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Expiration date (MM / YY)"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          maxLength={7}
                        />
                        <Input
                          placeholder="Security code"
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value)}
                          maxLength={4}
                          type="password"
                        />
                      </div>
                      <Input
                        placeholder="Name on card"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAddress"
                          checked={useSameAddress}
                          onCheckedChange={(checked) =>
                            setUseSameAddress(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="sameAddress"
                          className="text-sm text-gray-600"
                        >
                          Use shipping address as billing address
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B4513] hover:bg-[#723A0F] text-white h-12 text-base font-medium rounded-md"
              >
                {loading ? "Processing..." : "Pay now"}
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:border-l lg:pl-8">
            <div className="bg-white rounded-lg p-6 sticky top-6">
              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👗</span>
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-xs text-muted-foreground">
                          {item.color}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      AED {(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    className="border-gray-300"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">AED {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    AED {shippingCost.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">
                    <span className="text-xs text-muted-foreground mr-1">
                      AED
                    </span>
                    {(total + shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
