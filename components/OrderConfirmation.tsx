// emails/OrderConfirmation.tsx
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { CartItem } from "@/contexts/cart-context";
import React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shippingFee: number;
  cashCollectionFee: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    postalCode: string;
  };
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderId,
  items,
  total,
  subtotal,
  shippingFee,
  cashCollectionFee,
  shippingAddress,
}) => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>New Order Received: {orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              src="https://your-domain.com/images/baby-bazaar-logo.svg"
              width="200"
              height="50"
              alt="Baby Bazaar Logo"
            />
          </Section>
          <Section style={header}>
            <Heading style={heading}>New Order Received!</Heading>
            <Text style={subheading}>Order ID: {orderId}</Text>
            <Text style={date}>{formattedDate}</Text>
          </Section>
          <Hr style={divider} />
          <Section>
            <Heading as="h2" style={sectionHeading}>
              Customer Information
            </Heading>
            <Text style={text}>Name: {shippingAddress.fullName}</Text>
            <Text style={text}>Phone: {shippingAddress.phone}</Text>
            <Text style={text}>Address: {shippingAddress.address}</Text>
            <Text style={text}>Postal Code: {shippingAddress.postalCode}</Text>
          </Section>
          <Hr style={divider} />
          <Section>
            <Heading as="h2" style={sectionHeading}>
              Order Details
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={productRow}>
                <Column style={productImageColumn}>
                  <Img
                    src={item.image || "https://your-domain.com/placeholder.svg"}
                    width="80"
                    height="80"
                    alt={item.name}
                    style={productImage}
                  />
                </Column>
                <Column style={productDetailsColumn}>
                  <Text style={productName}>{item.name}</Text>
                  <Text style={productMeta}>
                    Quantity: {item.quantity} × {item.price.toFixed(2)} EGP
                  </Text>
                  <Text style={productPrice}>
                    {(item.price * item.quantity).toFixed(2)} EGP
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={divider} />
          <Section>
            <Row style={summaryRow}>
              <Column style={summaryLabelColumn}>
                <Text style={summaryLabel}>Subtotal:</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>{subtotal.toFixed(2)} EGP</Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column style={summaryLabelColumn}>
                <Text style={summaryLabel}>Shipping Fee:</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>{shippingFee.toFixed(2)} EGP</Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column style={summaryLabelColumn}>
                <Text style={summaryLabel}>Cash Collection Fee:</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>
                  {cashCollectionFee.toFixed(2)} EGP
                </Text>
              </Column>
            </Row>
            <Hr style={divider} />
            <Row style={totalRow}>
              <Column style={summaryLabelColumn}>
                <Text style={totalLabel}>Total:</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={totalValue}>{total.toFixed(2)} EGP</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Baby Bazaar. All rights reserved.
            </Text>
            <Text style={footerText}>
              If you have any questions, reply to this email or contact us at{" "}
              <Link href="tel:+201559844559">+20 1559844559</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const logo = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#112938",
  margin: "0",
};

const subheading = {
  fontSize: "18px",
  color: "#0CC0DF",
  margin: "10px 0 0",
};

const date = {
  fontSize: "14px",
  color: "#687385",
  margin: "10px 0 0",
};

const divider = {
  borderTop: "1px solid #e6ebf1",
  margin: "20px 0",
};

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#112938",
  margin: "0 0 15px",
};

const text = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#4a5568",
  margin: "0 0 10px",
};

const productRow = {
  marginBottom: "15px",
};

const productImageColumn = {
  width: "80px",
  verticalAlign: "top",
};

const productImage = {
  border: "1px solid #e6ebf1",
  borderRadius: "4px",
  objectFit: "cover" as const,
};

const productDetailsColumn = {
  paddingLeft: "15px",
  verticalAlign: "top",
};

const productName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#112938",
  margin: "0 0 5px",
};

const productMeta = {
  fontSize: "14px",
  color: "#687385",
  margin: "0 0 5px",
};

const productPrice = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#112938",
  margin: "0",
};

const summaryRow = {
  margin: "0 0 5px",
};

const summaryLabelColumn = {
  width: "60%",
  textAlign: "right" as const,
  paddingRight: "10px",
};

const summaryValueColumn = {
  width: "40%",
  textAlign: "right" as const,
};

const summaryLabel = {
  fontSize: "14px",
  color: "#687385",
  margin: "0",
};

const summaryValue = {
  fontSize: "14px",
  color: "#112938",
  margin: "0",
};

const totalRow = {
  margin: "10px 0",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#112938",
  margin: "0",
};

const totalValue = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#112938",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
  padding: "20px 0 0",
};

const footerText = {
  fontSize: "12px",
  color: "#687385",
  margin: "0 0 10px",
};

export default OrderConfirmationEmail;