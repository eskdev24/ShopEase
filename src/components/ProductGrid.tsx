import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  filters?: {
    categories?: string[];
    priceRange?: [number, number];
    sortBy?: "price-asc" | "price-desc" | "rating" | "newest";
  };
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products = mockProducts,
  loading = false,
  filters = {},
}) => {
  // Filter and sort products based on filters
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories?.includes(product.category),
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(
        (product) => product.price >= min && product.price <= max,
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          // In a real app, we would sort by date
          // For now, we'll just use the original order
          break;
      }
    }

    return result;
  }, [products, filters]);

  if (loading) {
    return (
      <div className="w-full bg-background p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-muted rounded-lg h-80"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-4">
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80">
          <h3 className="text-xl font-medium text-muted-foreground">
            No products found
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Desk Lamp",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    rating: 4.5,
    category: "home",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&q=80",
    rating: 4.8,
    category: "furniture",
  },
  {
    id: "3",
    name: "Wireless Headphones",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    rating: 4.3,
    category: "electronics",
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    rating: 4.6,
    category: "electronics",
  },
  {
    id: "5",
    name: "Ceramic Coffee Mug",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
    rating: 4.2,
    category: "home",
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
    rating: 4.4,
    category: "accessories",
  },
  {
    id: "7",
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    rating: 4.1,
    category: "electronics",
  },
  {
    id: "8",
    name: "Minimalist Backpack",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400&q=80",
    rating: 4.7,
    category: "accessories",
  },
];

export default ProductGrid;
