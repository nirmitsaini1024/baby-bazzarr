// lib/email.ts
import { Resend } from "resend";
import { CartItem } from "@/contexts/cart-context";

// Initialize Resend with your API key - you'll need to add this to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

// Email to send order notifications to (your email)
const STORE_EMAIL = "jisoso1717@gmail.com";
// Type for shipping address
type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
};

// Function to send order notification emails
export async function sendOrderNotification(
  orderId: string,
  items: CartItem[],
  total: number,
  shippingAddress: ShippingAddress,
  type: "new" | "cancelled" = "new",
  reason?: string
) {
  // Format the items for the email
  const itemsList = items
    .map(
      (item) =>
        `${item.name} - Quantity: ${item.quantity} - Price: ${item.price.toFixed(
          2
        )} EGP - Subtotal: ${(item.price * item.quantity).toFixed(2)} EGP`
    )
    .join("\n");

  // Calculate some order details
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 57; // Your fixed shipping fee
  const cashCollectionFee = 10; // Your fixed cash collection fee

  // Create the plain text email content for fallback
  const textEmailContent = type === "new" ? `
New Order Received!

Order ID: ${orderId}
Items: ${itemCount}
Total: ${total.toFixed(2)} EGP

Customer Information:
Name: ${shippingAddress.fullName}
Phone: ${shippingAddress.phone}
Address: ${shippingAddress.address}
Postal Code: ${shippingAddress.postalCode}

Order Details:
${itemsList}

Subtotal: ${subtotal.toFixed(2)} EGP
Shipping Fee: ${shippingFee.toFixed(2)} EGP
Cash Collection Fee: ${cashCollectionFee.toFixed(2)} EGP
Total: ${total.toFixed(2)} EGP
` : `
Order Cancelled!

Order ID: ${orderId}
Items: ${itemCount}
Total: ${total.toFixed(2)} EGP
${reason ? `Cancellation Reason: ${reason}` : ''}

Customer Information:
Name: ${shippingAddress.fullName}
Phone: ${shippingAddress.phone}
Address: ${shippingAddress.address}
Postal Code: ${shippingAddress.postalCode}

Order Details:
${itemsList}

Subtotal: ${subtotal.toFixed(2)} EGP
Shipping Fee: ${shippingFee.toFixed(2)} EGP
Cash Collection Fee: ${cashCollectionFee.toFixed(2)} EGP
Total: ${total.toFixed(2)} EGP
`;

  // Create the HTML email content
  const htmlEmailContent = type === "new" ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      margin-bottom: 15px;
    }
    h1 {
      color: #4a6fb0;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .order-summary {
      background-color: #f7faff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      border-left: 4px solid #4a6fb0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .customer-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f7f7f7;
      border-radius: 6px;
    }
    .order-details {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f0f5ff;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #eee;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .grand-total {
      font-weight: bold;
      color: #4a6fb0;
      font-size: 18px;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      color: #999999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Received! 🎉</h1>
      <p>An order has been placed and is ready for processing</p>
    </div>
    
    <div class="order-summary">
      <div class="summary-item">
        <strong>Order ID:</strong>
        <span>${orderId}</span>
      </div>
      <div class="summary-item">
        <strong>Items:</strong>
        <span>${itemCount}</span>
      </div>
      <div class="summary-item">
        <strong>Total:</strong>
        <span>${total.toFixed(2)} EGP</span>
      </div>
    </div>
    
    <div class="customer-info">
      <h2>Customer Information</h2>
      <p><strong>Name:</strong> ${shippingAddress.fullName}</p>
      <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
      <p><strong>Address:</strong> ${shippingAddress.address}</p>
      <p><strong>Postal Code:</strong> ${shippingAddress.postalCode}</p>
    </div>
    
    <div class="order-details">
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} EGP</td>
              <td>${(item.price * item.quantity).toFixed(2)} EGP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>${shippingFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Cash Collection Fee:</span>
          <span>${cashCollectionFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Baby Bazaar - Your Trusted Source for Baby Products</p>
      <p>© ${new Date().getFullYear()} Baby Bazaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
` : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Cancelled Notification</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      margin-bottom: 15px;
    }
    h1 {
      color: #4a6fb0;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .order-summary {
      background-color: #f7faff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      border-left: 4px solid #4a6fb0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .customer-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f7f7f7;
      border-radius: 6px;
    }
    .order-details {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f0f5ff;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #eee;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .grand-total {
      font-weight: bold;
      color: #4a6fb0;
      font-size: 18px;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      color: #999999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Cancelled! ⚠️</h1>
      <p>An order has been cancelled</p>
    </div>
    
    <div class="order-summary">
      <div class="summary-item">
        <strong>Order ID:</strong>
        <span>${orderId}</span>
      </div>
      <div class="summary-item">
        <strong>Items:</strong>
        <span>${itemCount}</span>
      </div>
      <div class="summary-item">
        <strong>Total:</strong>
        <span>${total.toFixed(2)} EGP</span>
      </div>
      ${reason ? `
      <div class="summary-item">
        <strong>Cancellation Reason:</strong>
        <span>${reason}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="customer-info">
      <h2>Customer Information</h2>
      <p><strong>Name:</strong> ${shippingAddress.fullName}</p>
      <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
      <p><strong>Address:</strong> ${shippingAddress.address}</p>
      <p><strong>Postal Code:</strong> ${shippingAddress.postalCode}</p>
    </div>
    
    <div class="order-details">
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} EGP</td>
              <td>${(item.price * item.quantity).toFixed(2)} EGP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>${shippingFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Cash Collection Fee:</span>
          <span>${cashCollectionFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Baby Bazaar - Your Trusted Source for Baby Products</p>
      <p>© ${new Date().getFullYear()} Baby Bazaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Baby Bazaar <orders@10xdevs.in>`,
      to: STORE_EMAIL,
      subject: type === "new" ? `New Order Received: ${orderId}` : `Order Cancelled: ${orderId}`,
      html: htmlEmailContent,
      text: textEmailContent,
    });

    if (error) {
      console.error("Error sending order notification email:", error);
      return { success: false, error };
    }

    console.log("Order notification email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending order notification email:", error);
    return { success: false, error };
  }
}

// Function to send order confirmation email to user
export async function sendUserOrderConfirmation(
  userEmail: string,
  orderId: string,
  items: CartItem[],
  total: number,
  shippingAddress: ShippingAddress,
  type: "new" | "cancelled" = "new",
  reason?: string
) {
  // Format the items for the email
  const itemsList = items
    .map(
      (item) =>
        `${item.name} - Quantity: ${item.quantity} - Price: ${item.price.toFixed(
          2
        )} EGP - Subtotal: ${(item.price * item.quantity).toFixed(2)} EGP`
    )
    .join("\n");

  // Calculate some order details
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 57; // Your fixed shipping fee
  const cashCollectionFee = 10; // Your fixed cash collection fee

  // Create the plain text email content for fallback
  const textEmailContent = type === "new" ? `
Thank you for your order!

Order ID: ${orderId}
Items: ${itemCount}
Total: ${total.toFixed(2)} EGP

Your Information:
Name: ${shippingAddress.fullName}
Phone: ${shippingAddress.phone}
Address: ${shippingAddress.address}
Postal Code: ${shippingAddress.postalCode}

Order Details:
${itemsList}

Subtotal: ${subtotal.toFixed(2)} EGP
Shipping Fee: ${shippingFee.toFixed(2)} EGP
Cash Collection Fee: ${cashCollectionFee.toFixed(2)} EGP
Total: ${total.toFixed(2)} EGP

We'll contact you soon to confirm delivery details.
` : `
Your order has been cancelled.

Order ID: ${orderId}
Items: ${itemCount}
Total: ${total.toFixed(2)} EGP
${reason ? `Cancellation Reason: ${reason}` : ''}

Your Information:
Name: ${shippingAddress.fullName}
Phone: ${shippingAddress.phone}
Address: ${shippingAddress.address}
Postal Code: ${shippingAddress.postalCode}

Order Details:
${itemsList}

Subtotal: ${subtotal.toFixed(2)} EGP
Shipping Fee: ${shippingFee.toFixed(2)} EGP
Cash Collection Fee: ${cashCollectionFee.toFixed(2)} EGP
Total: ${total.toFixed(2)} EGP

If you have any questions, please contact our customer service.
`;

  // Create the HTML email content
  const htmlEmailContent = type === "new" ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      margin-bottom: 15px;
    }
    h1 {
      color: #4a6fb0;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .order-summary {
      background-color: #f7faff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      border-left: 4px solid #4a6fb0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .customer-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f7f7f7;
      border-radius: 6px;
    }
    .order-details {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f0f5ff;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #eee;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .grand-total {
      font-weight: bold;
      color: #4a6fb0;
      font-size: 18px;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      color: #999999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Order! 🎉</h1>
      <p>We're excited to process your order</p>
    </div>
    
    <div class="order-summary">
      <div class="summary-item">
        <strong>Order ID:</strong>
        <span>${orderId}</span>
      </div>
      <div class="summary-item">
        <strong>Items:</strong>
        <span>${itemCount}</span>
      </div>
      <div class="summary-item">
        <strong>Total:</strong>
        <span>${total.toFixed(2)} EGP</span>
      </div>
    </div>
    
    <div class="customer-info">
      <h2>Your Information</h2>
      <p><strong>Name:</strong> ${shippingAddress.fullName}</p>
      <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
      <p><strong>Address:</strong> ${shippingAddress.address}</p>
      <p><strong>Postal Code:</strong> ${shippingAddress.postalCode}</p>
    </div>
    
    <div class="order-details">
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} EGP</td>
              <td>${(item.price * item.quantity).toFixed(2)} EGP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>${shippingFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Cash Collection Fee:</span>
          <span>${cashCollectionFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>We'll contact you soon to confirm delivery details.</p>
      <p>Baby Bazaar - Your Trusted Source for Baby Products</p>
      <p>© ${new Date().getFullYear()} Baby Bazaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
` : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Cancelled</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      margin-bottom: 15px;
    }
    h1 {
      color: #4a6fb0;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .order-summary {
      background-color: #f7faff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      border-left: 4px solid #4a6fb0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .customer-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f7f7f7;
      border-radius: 6px;
    }
    .order-details {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f0f5ff;
      text-align: left;
      padding: 10px;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #eee;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .grand-total {
      font-weight: bold;
      color: #4a6fb0;
      font-size: 18px;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      color: #999999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Cancelled</h1>
      <p>Your order has been cancelled</p>
    </div>
    
    <div class="order-summary">
      <div class="summary-item">
        <strong>Order ID:</strong>
        <span>${orderId}</span>
      </div>
      <div class="summary-item">
        <strong>Items:</strong>
        <span>${itemCount}</span>
      </div>
      <div class="summary-item">
        <strong>Total:</strong>
        <span>${total.toFixed(2)} EGP</span>
      </div>
      ${reason ? `
      <div class="summary-item">
        <strong>Cancellation Reason:</strong>
        <span>${reason}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="customer-info">
      <h2>Your Information</h2>
      <p><strong>Name:</strong> ${shippingAddress.fullName}</p>
      <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
      <p><strong>Address:</strong> ${shippingAddress.address}</p>
      <p><strong>Postal Code:</strong> ${shippingAddress.postalCode}</p>
    </div>
    
    <div class="order-details">
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} EGP</td>
              <td>${(item.price * item.quantity).toFixed(2)} EGP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>${shippingFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row">
          <span>Cash Collection Fee:</span>
          <span>${cashCollectionFee.toFixed(2)} EGP</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please contact our customer service.</p>
      <p>Baby Bazaar - Your Trusted Source for Baby Products</p>
      <p>© ${new Date().getFullYear()} Baby Bazaar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: `Baby Bazaar <orders@10xdevs.in>`,
      to: userEmail,
      subject: type === "new" ? `Order Confirmation: ${orderId}` : `Order Cancelled: ${orderId}`,
      html: htmlEmailContent,
      text: textEmailContent,
    });

    if (error) {
      console.error("Error sending user order confirmation email:", error);
      return { success: false, error };
    }

    console.log("User order confirmation email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending user order confirmation email:", error);
    return { success: false, error };
  }
}