// app/api/orders/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOrder, getUserOrders } from "@/models/order";
import { clearUserCart } from "@/models/cart";
import { updateUserProfile } from "@/models/user";
import { sendOrderNotification, sendUserOrderConfirmation } from "@/lib/email";

// Define interfaces to match your database types
interface OrderDocument {
  _id?: string;
  orderId: string;
  userId: string;
  userEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  statusAr: string;
  date: string;
  expectedDelivery: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    postalCode: string;
  };
  createdAt?: Date;
}

export async function GET(req: NextRequest) {
  try {
    // console.log("GET /api/orders - Starting request");
    const { userId } = await auth();

    if (!userId) {
      // console.log("GET /api/orders - Unauthorized: No userId found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // console.log(`GET /api/orders - Fetching orders for user ${userId}`);
    const orders = await getUserOrders(userId);
    // console.log(`GET /api/orders - Found ${orders.length} orders`);

    // Log the structure of the first order to help debug format issues
    if (orders.length > 0) {
      const firstOrder = orders[0] as OrderDocument;
      // console.log(
      //   "GET /api/orders - Sample order structure:",
      //   JSON.stringify({
      //     _id: firstOrder._id,
      //     orderId: firstOrder.orderId,
      //     status: firstOrder.status,
      //     itemsCount: firstOrder.items?.length || 0,
      //   })
      // );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders - Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // console.log("POST /api/orders - Starting request");
    const { userId } = await auth();

    if (!userId) {
      // console.log("POST /api/orders - Unauthorized: No userId found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // console.log(`POST /api/orders - Processing order for user ${userId}`);
    let orderData;

    try {
      orderData = await req.json();
      // console.log("POST /api/orders - Order data received:", {
      //   itemsCount: orderData.items?.length || 0,
      //   total: orderData.total,
      //   hasShippingAddress: !!orderData.shippingAddress,
      // });
    } catch (parseError) {
      console.error("POST /api/orders - Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate required order data
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      console.error("POST /api/orders - Missing or invalid items");
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    if (!orderData.total || typeof orderData.total !== "number") {
      console.error("POST /api/orders - Missing or invalid total");
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      console.error("POST /api/orders - Missing shipping address");
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Check for required shipping address fields
    const requiredAddressFields = ["fullName", "phone", "address", "postalCode"];
    for (const field of requiredAddressFields) {
      if (!orderData.shippingAddress[field]) {
        console.error(
          `POST /api/orders - Missing required shipping address field: ${field}`
        );
        return NextResponse.json(
          {
            error: `Missing required field in shipping address: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Generate order ID
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    // console.log(`POST /api/orders - Generated order ID: ${orderId}`);

    // Calculate expected delivery date (7 days from now)
    const date = new Date();
    const expectedDelivery = new Date(date);
    expectedDelivery.setDate(date.getDate() + 7);

    const formattedDate = date.toISOString().split("T")[0];
    const formattedExpectedDelivery = expectedDelivery.toISOString().split("T")[0];
    // console.log(
    //   `POST /api/orders - Date: ${formattedDate}, Expected delivery: ${formattedExpectedDelivery}`
    // );

    // Create the order
    let newOrderId;
    try {
      // console.log("POST /api/orders - Creating order in database");

      // Use the correct type to match what createOrder expects
      const orderToCreate: Omit<OrderDocument, "_id" | "createdAt"> = {
        orderId,
        userId,
        userEmail: orderData.email,
        items: orderData.items,
        total: orderData.total,
        status: "Processing",
        statusAr: "قيد المعالجة",
        date: formattedDate,
        expectedDelivery: formattedExpectedDelivery,
        shippingAddress: orderData.shippingAddress,
      };

      newOrderId = await createOrder(orderToCreate);
      // console.log(`POST /api/orders - Order created successfully with ID: ${newOrderId}`);
      
      // Send email notifications
      try {
        // Send notification to store
        const storeEmailResult = await sendOrderNotification(
          orderId,
          orderData.items,
          orderData.total,
          orderData.shippingAddress
        );
        
        if (!storeEmailResult.success) {
          console.error("Failed to send store notification email:", storeEmailResult.error);
        }

        // Send confirmation to user
        const userEmailResult = await sendUserOrderConfirmation(
          orderData.email, // Make sure to include email in the order data
          orderId,
          orderData.items,
          orderData.total,
          orderData.shippingAddress
        );

        if (!userEmailResult.success) {
          console.error("Failed to send user confirmation email:", userEmailResult.error);
        }
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
        // Continue with order processing even if emails fail
      }
    } catch (createOrderError) {
      console.error("POST /api/orders - Error creating order in database:", createOrderError);
      return NextResponse.json(
        {
          error: `Failed to create order in database: ${
            createOrderError instanceof Error
              ? createOrderError.message
              : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }

    // Clear the user's cart
    try {
      // console.log(`POST /api/orders - Clearing cart for user ${userId}`);
      await clearUserCart(userId);
      // console.log("POST /api/orders - Cart cleared successfully");
    } catch (cartError) {
      // Log but continue, don't fail the order just because cart clearing failed
      console.error("POST /api/orders - Error clearing cart:", cartError);
    }

    // console.log("POST /api/orders - Order process completed successfully");

    // IMPORTANT FIX: Return the orderId not the database ID
    return NextResponse.json({
      success: true,
      orderId: orderId, // Return the ORD-XXXXX ID, not the database ID
    });
  } catch (error) {
    console.error("POST /api/orders - Uncaught error:", error);
    return NextResponse.json(
      {
        error: `Failed to create order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}