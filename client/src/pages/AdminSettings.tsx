import React, { useEffect, useState } from "react";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Store, CreditCard, Package, Mail, Plug } from "lucide-react";

type Setting = {
  id: string;
  key: string;
  value: any;
  group?: string;
  description?: string;
};

type StoreSettings = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  taxRate: number;
};

type PaymentSettings = {
  stripePublicKey: string;
  stripeSecretKey: string;
  testMode: boolean;
};

type ShippingSettings = {
  defaultCost: number;
  freeShippingThreshold: number;
  enabled: boolean;
};

type EmailSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
};

export default function AdminSettings() {
  useProtectedAdmin();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allSettings, setAllSettings] = useState<Setting[]>([]);

  // Store settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "Abaya Store",
    storeEmail: "contact@abayastore.com",
    storePhone: "+971 50 123 4567",
    currency: "AED",
    taxRate: 5,
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripePublicKey: "",
    stripeSecretKey: "",
    testMode: true,
  });

  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    defaultCost: 25,
    freeShippingThreshold: 500,
    enabled: true,
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "Abaya Store",
  });

  const token = localStorage.getItem("adminToken");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const settings = data.data?.items || [];
      setAllSettings(settings);

      // Parse settings by group
      settings.forEach((s: Setting) => {
        if (s.group === "store") {
          setStoreSettings((prev) => ({ ...prev, [s.key]: s.value }));
        } else if (s.group === "payment") {
          setPaymentSettings((prev) => ({ ...prev, [s.key]: s.value }));
        } else if (s.group === "shipping") {
          setShippingSettings((prev) => ({ ...prev, [s.key]: s.value }));
        } else if (s.group === "email") {
          setEmailSettings((prev) => ({ ...prev, [s.key]: s.value }));
        }
      });
    } catch (error) {
      console.error("Load settings error:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettingsGroup = async (
    group: string,
    settings: Record<string, any>,
  ) => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(async ([key, value]) => {
        const existing = allSettings.find(
          (s) => s.key === key && s.group === group,
        );

        if (existing) {
          // Update existing setting
          return fetch(`/api/admin/settings/${existing.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ value, group }),
          });
        } else {
          // Create new setting
          return fetch(`/api/admin/settings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ key, value, group }),
          });
        }
      });

      await Promise.all(updates);

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      await loadSettings();
    } catch (error) {
      console.error("Save settings error:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="plugins" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Plugins
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeName: e.target.value,
                    })
                  }
                  placeholder="Your Store Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeEmail: e.target.value,
                    })
                  }
                  placeholder="contact@store.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.storePhone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storePhone: e.target.value,
                    })
                  }
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        currency: e.target.value,
                      })
                    }
                    placeholder="AED"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="5"
                  />
                </div>
              </div>

              <Button
                onClick={() => saveSettingsGroup("store", storeSettings)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Store Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure Stripe payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublicKey">Stripe Publishable Key</Label>
                <Input
                  id="stripePublicKey"
                  value={paymentSettings.stripePublicKey}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      stripePublicKey: e.target.value,
                    })
                  }
                  placeholder="pk_test_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={paymentSettings.stripeSecretKey}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      stripeSecretKey: e.target.value,
                    })
                  }
                  placeholder="sk_test_..."
                />
                <p className="text-sm text-gray-500">
                  Keep this secret and never share it publicly
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="testMode">Test Mode</Label>
                  <p className="text-sm text-gray-500">
                    Use Stripe test keys for development
                  </p>
                </div>
                <Switch
                  id="testMode"
                  checked={paymentSettings.testMode}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      testMode: checked,
                    })
                  }
                />
              </div>

              <Button
                onClick={() => saveSettingsGroup("payment", paymentSettings)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Payment Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
              <CardDescription>
                Configure shipping costs and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shippingEnabled">Enable Shipping</Label>
                  <p className="text-sm text-gray-500">
                    Enable shipping for orders
                  </p>
                </div>
                <Switch
                  id="shippingEnabled"
                  checked={shippingSettings.enabled}
                  onCheckedChange={(checked) =>
                    setShippingSettings({
                      ...shippingSettings,
                      enabled: checked,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCost">
                  Default Shipping Cost ({storeSettings.currency})
                </Label>
                <Input
                  id="defaultCost"
                  type="number"
                  value={shippingSettings.defaultCost}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      defaultCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">
                  Free Shipping Threshold ({storeSettings.currency})
                </Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      freeShippingThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="500"
                />
                <p className="text-sm text-gray-500">
                  Orders above this amount get free shipping
                </p>
              </div>

              <Button
                onClick={() => saveSettingsGroup("shipping", shippingSettings)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Shipping Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpHost: e.target.value,
                      })
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        smtpPort: parseInt(e.target.value) || 587,
                      })
                    }
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={emailSettings.smtpUser}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpUser: e.target.value,
                    })
                  }
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      senderEmail: e.target.value,
                    })
                  }
                  placeholder="noreply@abayastore.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={emailSettings.senderName}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      senderName: e.target.value,
                    })
                  }
                  placeholder="Abaya Store"
                />
              </div>

              <Button
                onClick={() => saveSettingsGroup("email", emailSettings)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Email Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plugins */}
        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle>Plugin Management</CardTitle>
              <CardDescription>
                Manage installed plugins and their settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Inventory Management Plugin */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Inventory Management</h3>
                      <p className="text-sm text-gray-500">
                        Automatic stock tracking and low stock alerts
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Version 1.0.0
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Low Stock Threshold:
                      </span>
                      <span className="font-medium">10 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Prevent Overselling:
                      </span>
                      <span className="font-medium">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Low Stock Notifications:
                      </span>
                      <span className="font-medium">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Plug className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>More plugins coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
