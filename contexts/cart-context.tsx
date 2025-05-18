"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useOrder } from "@/contexts/order-context"; // Import the order context

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: ShippingAddress) => Promise<string>;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  cashCollectionFee: number;
  total: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const { refreshOrders } = useOrder(); // Use the refreshOrders function from OrderContext

  // Fixed fees
  const shippingFee = 57;
  const cashCollectionFee = 10;

  // Fetch cart from API on initial render and when user changes
  useEffect(() => {
    // Modify the fetchCart function in your CartContext
    async function fetchCart() {
      if (!isSignedIn || !userId) {
        // If not signed in, try to get cart from localStorage
        try {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } catch (error: any) {
          console.error("Failed to parse cart from localStorage:", error);
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else if (response.status === 401) {
          // If unauthorized, fall back to localStorage cart
          console.log(
            "User not authenticated for cart API, using localStorage"
          );
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } else {
          console.error("Failed to fetch cart:", await response.text());
        }
      } catch (error: any) {
        console.error("Error fetching cart:", error);
        // Still try localStorage as fallback
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [userId, isSignedIn]);

  // Save cart to API when items change
  useEffect(() => {
    if (isLoading) return;

    // Always save to localStorage as a fallback
    localStorage.setItem("cart", JSON.stringify(items));

    // If signed in, save to API
    if (isSignedIn && userId) {
      const saveCart = async () => {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
          });
        } catch (error: any) {
          console.error("Error saving cart:", error);
        }
      };

      saveCart();
    }
  }, [items, isSignedIn, userId, isLoading]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex >= 0) {
        // If it exists, increase the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // If it doesn't exist, add it with quantity 1
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Place an order
  const placeOrder = async (shippingAddress: ShippingAddress) => {
    if (!isSignedIn) {
      // Redirect to sign in if not authenticated
      toast({
        title: "Please sign in to continue",
        description: "You need to be signed in to place an order",
      });

      // Save current cart to localStorage before redirecting
      localStorage.setItem("cart", JSON.stringify(items));

      router.push("/sign-in");
      return "";
    }

    try {
      console.log("Placing order with items:", items.length, "items");
      
      // Create a new order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [...items],
          total: total,
          shippingAddress,
          email: user?.primaryEmailAddress?.emailAddress, // Include user's email
        }),
      });

      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Order API error:", response.status, data);
        throw new Error(data.error || "Failed to create order");
      }

      console.log("Order created successfully:", data);

      // Clear the cart (API will clear the DB cart)
      clearCart();
      
      // Refresh orders to display the new order in the My Orders page
      try {
        console.log("Refreshing orders after successful order placement");
        await refreshOrders();
        console.log("Orders refreshed successfully");
      } catch (refreshError: any) {
        console.error("Failed to refresh orders:", refreshError);
        // Continue even if refreshing orders fails, as the order was placed successfully
      }

      // Show success toast
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${data.orderId} has been placed.`,
      });

      return data.orderId;
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: `Failed to place your order: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
      return "";
    }
  };

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate total (subtotal + shipping + cash collection fee)
  const total = subtotal + shippingFee + cashCollectionFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        placeOrder,
        totalItems,
        subtotal,
        shippingFee,
        cashCollectionFee,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};