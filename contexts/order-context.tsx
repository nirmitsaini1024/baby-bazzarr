"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import type { CartItem } from "@/contexts/cart-context"

export type Order = {
  orderId: string
  date: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  statusAr: string
  total: number
  expectedDelivery: string
  items: CartItem[]
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    postalCode: string
  }
}

type OrderContextType = {
  orders: Order[]
  addOrder: (order: Omit<Order, "orderId" | "date" | "status" | "statusAr" | "expectedDelivery">) => string
  getOrderById: (id: string) => Promise<Order | undefined>
  isLoading: boolean
  refreshOrders: () => Promise<void> // Add this function to manually refresh orders
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, isSignedIn } = useAuth()

  // Create a function to fetch orders that can be called manually
  const refreshOrders = async () => {
    if (!isSignedIn || !userId) {
      setOrders([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      console.log("Fetching orders for user:", userId);
      const response = await fetch("/api/orders")
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch orders:", errorText);
        throw new Error(`Failed to fetch orders: ${errorText}`);
      }
      
      const data = await response.json()
      console.log("Orders received from API:", data.orders);

      // Transform the API response to match our Order type
      const transformedOrders = data.orders.map((order: any) => ({
        orderId: order.orderId,
        date: order.date,
        status: order.status,
        statusAr: order.statusAr,
        total: order.total,
        expectedDelivery: order.expectedDelivery,
        items: order.items,
        shippingAddress: order.shippingAddress,
      }));
      
      console.log("Transformed orders:", transformedOrders);
      setOrders(transformedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch orders from API on initial render and when user changes
  useEffect(() => {
    refreshOrders()
  }, [userId, isSignedIn])

  // Generate a random order ID
  const generateOrderId = () => {
    return `ORD-${Math.floor(10000 + Math.random() * 90000)}`
  }

  // Calculate expected delivery date (7 days from now)
  const calculateExpectedDelivery = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().split("T")[0]
  }

  // Add a new order (this is now just for compatibility, actual orders are added via API)
  const addOrder = (order: Omit<Order, "orderId" | "date" | "status" | "statusAr" | "expectedDelivery">) => {
    const orderId = generateOrderId()

    const newOrder: Order = {
      ...order,
      orderId,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      statusAr: "قيد المعالجة",
      expectedDelivery: calculateExpectedDelivery(),
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    return orderId
  }

  // Get an order by ID
  const getOrderById = async (id: string): Promise<Order | undefined> => {
    console.log("getOrderById called with ID:", id);
    console.log("Current orders:", orders);
    
    // First try to find the order in the local state
    let order = orders.find((order) => order.orderId === id);
    
    // If not found in local state, try to fetch from API
    if (!order) {
      try {
        console.log("Order not found in local state, fetching from API");
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          console.error("Failed to fetch order from API:", response.status);
          return undefined;
        }
        const data = await response.json();
        order = data.order;
        
        // If we found the order, add it to the local state
        if (order) {
          setOrders(prevOrders => [...prevOrders, order as Order]);
        }
      } catch (error) {
        console.error("Error fetching order from API:", error);
        return undefined;
      }
    }
    
    console.log("Found order:", order);
    return order;
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        isLoading,
        refreshOrders, // Add the refreshOrders function to the context
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}