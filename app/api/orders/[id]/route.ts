import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrderById, updateOrderStatus } from "@/models/order";
import { sendOrderNotification, sendUserOrderConfirmation } from "@/lib/email";
import { getUserProfile } from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify that the order belongs to the authenticated user
    if (order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, reason } = await request.json();
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the order ID from params
    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    await updateOrderStatus(orderId, status);

    // Get user profile to get email
    const userProfile = await getUserProfile(userId);
    if (!userProfile?.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Send email notifications
    try {
      // Send cancellation notification to store
      await sendOrderNotification(
        order.orderId,
        order.items,
        order.total,
        order.shippingAddress,
        "cancelled",
        reason
      );

      // Send cancellation confirmation to user
      await sendUserOrderConfirmation(
        userProfile.email,
        order.orderId,
        order.items,
        order.total,
        order.shippingAddress,
        "cancelled",
        reason
      );
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Continue with the response even if email sending fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}