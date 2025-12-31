import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/product/ProductCard";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Slider } from "@/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Card } from "@/ui/card";
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
    <div className="container py-16 md:py-24 px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 md:pt-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 md:mb-20">
        <p className="text-xs tracking-[0.2em] uppercase font-light text-black/50 mb-4">
          Collections
        </p>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
          Shop All
        </h1>
        <p className="text-base md:text-lg text-black/70 max-w-2xl font-light leading-relaxed">
          Explore our curated range of premium abayas, crafted for elegance and comfort.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-3 md:flex-row md:gap-4">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search abayas..."
            className="w-full text-xs sm:text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-32 sm:w-40 md:w-[180px] text-xs sm:text-sm">
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
            className="md:hidden h-10 w-10 flex-shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Filters Sidebar */}
        <aside
          className={cn(
            "w-full md:w-64 space-y-6",
            showFilters ? "block" : "hidden md:block"
          )}
        >
          <Card className="p-3 sm:p-4 space-y-4 sm:space-y-6">
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
              <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base sm:text-lg font-medium">No products found</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4 text-xs sm:text-sm">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
              </p>
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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
