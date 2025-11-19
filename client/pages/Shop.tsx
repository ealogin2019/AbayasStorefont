import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get("colors")?.split(",").filter(Boolean) || []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get("sizes")?.split(",").filter(Boolean) || []
  );
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Build query params for API
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (selectedColors.length > 0) params.colors = selectedColors.join(",");
    if (selectedSizes.length > 0) params.sizes = selectedSizes.join(",");
    if (inStockOnly) params.inStock = "true";
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;
    return params;
  };

  // Fetch products with filters
  const { data, isLoading } = useQuery({
    queryKey: ["products", buildQueryParams()],
    queryFn: async () => {
      const params = new URLSearchParams(buildQueryParams());
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const products = data?.products ?? [];

  // Available filters (extract from all products for dynamic filters)
  const availableColors = ["Black", "White", "Navy", "Brown", "Beige", "Gray", "Green"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Apply filters
  const applyFilters = () => {
    const params = buildQueryParams();
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchParams({});
  };

  // Handle color selection
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Handle size selection
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    if (value === "price-asc") {
      setSortBy("price");
      setSortOrder("asc");
    } else if (value === "price-desc") {
      setSortBy("price");
      setSortOrder("desc");
    } else if (value === "name-asc") {
      setSortBy("name");
      setSortOrder("asc");
    } else if (value === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("createdAt");
      setSortOrder("asc");
    }
  };

  const activeFiltersCount = 
    (search ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (inStockOnly ? 1 : 0);

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight">
          Arab Abayas Collection
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mt-2">
          Explore our curated range of modern abayas, crafted for elegance and comfort.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search abayas by name, description, or tags..."
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside
          className={cn(
            "w-full md:w-64 space-y-6",
            showFilters ? "block" : "hidden md:block"
          )}
        >
          <Card className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range (AED)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Colors</Label>
              <div className="space-y-2">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => toggleColor(color)}
                    />
                    <label
                      htmlFor={`color-${color}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSize(size)}
                    className="h-8"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={(checked) => setInStockOnly(checked === true)}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </label>
            </div>

            {/* Apply Button */}
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
