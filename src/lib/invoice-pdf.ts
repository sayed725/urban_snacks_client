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
  const lightGray = [229, 231, 235];
  const emeraldColor = [5, 150, 105];
  const redColor = [220, 38, 38];

  // --- Header Section ---
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("URBAN SNACKS", 15, 20);

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.setFont("helvetica", "normal");
  doc.text("PREMIUM SNACKS & TREATS", 15, 26);
  doc.text("Dhaka, Bangladesh", 15, 30);

  // Invoice Title
  doc.setFontSize(26);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("INVOICE", pageWidth - 15, 22, { align: "right" });

  doc.setFontSize(10);
  doc.text(`#${order.orderNumber || order.id.slice(-8)}`, pageWidth - 15, 28, { align: "right" });
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text(moment(order.createdAt).format("MMMM DD, YYYY [at] hh:mm A"), pageWidth - 15, 33, { align: "right" });

  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 40, pageWidth - 15, 40);

  // --- Meta Info (Bill To & Status) ---
  // Bill To
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 15, 50);

  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39); // gray-900
  doc.text(order.shippingName, 15, 57);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99); // gray-600
  doc.text(order.shippingAddress, 15, 63);
  doc.text(`${order.shippingCity}, ${order.shippingPostalCode || ""}`, 15, 68);
  doc.text(order.shippingPhone, 15, 73);

  // Order Status & Payment Status
  const statusX = pageWidth - 65;
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER DETAILS", statusX, 50);

  // Order Status Badge
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Status:", statusX, 57);
  
  const isCancelled = order.status === "CANCELLED";
  const stColor = isCancelled ? redColor : emeraldColor;
  doc.setTextColor(stColor[0], stColor[1], stColor[2]);
  doc.text(order.status, statusX + 25, 57);

  // Payment Status
  doc.setTextColor(107, 114, 128);
  doc.text("Payment:", statusX, 63);
  const isPaid = order.paymentStatus === "PAID";
  doc.setTextColor(isPaid ? emeraldColor[0] : redColor[0], isPaid ? emeraldColor[1] : redColor[1], isPaid ? emeraldColor[2] : redColor[2]);
  doc.text(order.paymentStatus, statusX + 25, 63);

  // Method
  doc.setTextColor(107, 114, 128);
  doc.text("Method:", statusX, 69);
  doc.setTextColor(75, 85, 99);
  doc.text(order.paymentMethod, statusX + 25, 69);

  // --- Cancellation Reason ---
  if (isCancelled) {
    const reason = order.cancelReason || "No reason provided";
    doc.setFillColor(254, 242, 242); // red-50
    doc.roundedRect(15, 80, pageWidth - 30, 20, 3, 3, "F");
    
    doc.setFontSize(9);
    doc.setTextColor(185, 28, 28); // red-700
    doc.setFont("helvetica", "bold");
    doc.text("CANCELLATION REASON", 20, 87);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`"${reason}"`, 20, 93);
  }

  // --- Items Table ---
  const tableData = order.orderItems.map((item) => [
    item.item.name,
    item.quantity.toString(),
    `$${item.unitPrice.toFixed(2)}`,
    `$${(item.quantity * item.unitPrice).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: isCancelled ? 105 : 85,
    head: [["DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [55, 65, 81],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 15, right: 15 },
  });

  // --- Summary Section ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 80;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");

  // Subtotal
  const subtotal = order.orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  doc.text("Subtotal", summaryX, finalY);
  doc.setTextColor(17, 24, 39);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

  // Discount
  if (order.discountAmount) {
    doc.setTextColor(107, 114, 128);
    doc.text("Discount", summaryX, finalY + 8);
    doc.setTextColor(redColor[0], redColor[1], redColor[2]);
    doc.text(`-$${order.discountAmount.toFixed(2)}`, pageWidth - 15, finalY + 8, { align: "right" });
  }

  // Shipping (Assuming free for now as per dashboard UI)
  doc.setTextColor(107, 114, 128);
  doc.text("Shipping", summaryX, finalY + 16);
  doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
  doc.text("FREE", pageWidth - 15, finalY + 16, { align: "right" });

  // Grand Total Overlay
  const totalY = finalY + 25;
  doc.setFillColor(31, 41, 55);
  doc.roundedRect(summaryX - 5, totalY - 6, (pageWidth - summaryX) - 5, 12, 1, 1, "F");
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL AMOUNT", summaryX, totalY + 1);
  doc.text(`$${order.totalAmount.toFixed(2)}`, pageWidth - 20, totalY + 1, { align: "right" });

  // --- Footer ---
  const footerY = doc.internal.pageSize.height - 20;
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business! Stay Spicy.", pageWidth / 2, footerY, { align: "center" });

  // Save the PDF
  doc.save(`invoice-${order.orderNumber || order.id.slice(-8)}.pdf`);
};
