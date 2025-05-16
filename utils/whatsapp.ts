// utils/whatsapp.ts

/**
 * Opens WhatsApp with a pre-filled message to track an order
 * @param orderId The order ID to track
 */
export const openWhatsAppTracking = (orderId: string): void => {
  // The phone number with country code (Egypt +20)
  const phoneNumber = "201559844559"; // No spaces or plus symbol in the number for WhatsApp URLs
  
  // Create a message template for order tracking
  const message = `Hello, I would like to track my order ${orderId}. Can you please provide an update?`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};