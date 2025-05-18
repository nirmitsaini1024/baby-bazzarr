"use server";
import { updateOrderStatus } from "@/models/order";
import { redirect } from "next/navigation";

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;
  await updateOrderStatus(orderId, status as any);
  redirect("/admin/orders");
} 