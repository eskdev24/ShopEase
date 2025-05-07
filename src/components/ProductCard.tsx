import React from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Modern Ergonomic Chair",
  price = 199.99,
  image = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
  rating = 4.5,
  discount,
  isNew = false,
  onAddToCart,
}: ProductCardProps) => {
  const { addToCart } = useCart();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>,
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    // Add to cart using context
    addToCart({ id, name, price, image });

    // Also call the prop callback if provided (for backward compatibility)
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <Card className="w-full max-w-[270px] overflow-hidden transition-all duration-200 hover:shadow-lg bg-white">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {discount && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            {discount}% OFF
          </Badge>
        )}
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
            NEW
          </Badge>
        )}
      </div>

      <CardContent className="pt-4">
        <h3 className="font-medium text-base line-clamp-1">{name}</h3>
        <div className="flex items-center mt-1">
          <div className="flex items-center mr-2">{renderStars()}</div>
          <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
        </div>
        <div className="mt-2 flex items-center">
          <span className="font-semibold text-lg">${price.toFixed(2)}</span>
          {discount && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${(price / (1 - discount / 100)).toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full transition-colors"
          size="sm"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
