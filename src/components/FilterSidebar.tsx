import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FilterX } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sortBy: string;
}

const FilterSidebar = ({
  onFilterChange,
  className = "",
}: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    sortBy: "featured",
  });

  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "clothing", label: "Clothing" },
    { id: "home", label: "Home & Kitchen" },
    { id: "books", label: "Books" },
    { id: "toys", label: "Toys & Games" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);

    const updatedFilters = {
      ...filters,
      categories: updatedCategories,
    };

    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    };

    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSortChange = (value: string) => {
    const updatedFilters = {
      ...filters,
      sortBy: value,
    };

    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categories: [],
      priceRange: [0, 1000],
      sortBy: "featured",
    };

    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="pt-4">
              {/* Filter content for mobile */}
              {renderFilterContent()}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filter (always visible) */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <FilterX size={14} />
            Reset
          </Button>
        </div>
        {renderFilterContent()}
      </div>
    </div>
  );

  function renderFilterContent() {
    return (
      <>
        {/* Sort By Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Sort By</h3>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked === true)
                  }
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Price Range Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <div className="pt-4 px-2">
            <Slider
              defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              ${filters.priceRange[0]}
            </span>
            <span className="text-xs text-gray-500">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>

        {/* Mobile Only Reset Button */}
        <div className="md:hidden mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full text-xs"
          >
            Reset Filters
          </Button>
        </div>
      </>
    );
  }
};

export default FilterSidebar;
