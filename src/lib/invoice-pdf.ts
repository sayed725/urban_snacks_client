import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IOrder } from "@/types/order.type";
import moment from "moment";

export const generateInvoicePDF = (order: IOrder) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Colors
  const primaryColor = [245, 158, 11]; // amber-500
  const secondaryColor = [31, 41, 55]; // Gray-800
  const lightGray = [209, 213, 219];

  // Header - Brand
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("URBAN SNACKS", 15, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Snacks & Treats", 15, 26);
  doc.text("Dhaka, Bangladesh", 15, 31);

  // Invoice Title & Info
  doc.setFontSize(28);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("INVOICE", pageWidth - 15, 25, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Order ID: ${order.orderNumber || order.id}`, pageWidth - 15, 32, { align: "right" });
  doc.text(`Date: ${moment(order.createdAt).format("MMM DD, YYYY")}`, pageWidth - 15, 37, { align: "right" });

  // Divider
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(15, 45, pageWidth - 15, 45);

  // Billing Details
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 15, 55);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  doc.text(order.shippingName, 15, 62);
  doc.text(order.shippingPhone, 15, 68);
  doc.text(order.shippingAddress, 15, 74);
  doc.text(`${order.shippingCity}, ${order.shippingPostalCode || ""}`, 15, 80);

  // Payment Status Badge
  const isPaid = order.paymentStatus === "PAID";
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isPaid ? 5 : 220, isPaid ? 150 : 38, isPaid ? 105 : 38); // Emerald-600 or Red-600
  doc.text(isPaid ? "PAID" : "UNPAID", 15, 88);

  // Items Table
  const tableData = order.orderItems.map((item) => [
    item.item.name,
    item.quantity.toString(),
    `$${item.unitPrice.toFixed(2)}`,
    `$${(item.quantity * item.unitPrice).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 95,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: tableData,
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [50, 50, 50],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 15, right: 15 },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 60;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");

  // Subtotal
  const subtotal = order.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  doc.text("Subtotal:", summaryX, finalY);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

  // Discount
  if (order.discountAmount) {
    doc.text("Discount:", summaryX, finalY + 7);
    doc.setTextColor(220, 38, 38);
    doc.text(`-$${order.discountAmount.toFixed(2)}`, pageWidth - 15, finalY + 7, { align: "right" });
    doc.setTextColor(100);
  }

  // Grand Total
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", summaryX, finalY + 16);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`$${order.totalAmount.toFixed(2)}`, pageWidth - 15, finalY + 16, { align: "right" });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing Urban Snacks!", pageWidth / 2, pageWidth === 210 ? 285 : 275, { align: "center" });

  // Save the PDF
  doc.save(`invoice-${order.orderNumber || order.id}.pdf`);
};
