# 🎥 Urban Snacks - Video Presentation Guide

**Target Duration:** 5–10 Minutes  
**Objective:** Showcase the premium UI/UX, core e-commerce workflows (shopping, checkout, payments), and the robust admin dashboard managing the platform.

This script is designed to be conversational, professional, and highlight the technical achievements of the project. 

---

## ⏱️ Timeline Overview

1. **Introduction & Architecture (1 min)**
2. **Public Storefront & UX (2 mins)**
3. **The Shopping Flow & Checkout (2 mins)**
4. **Admin Dashboard & Management (3 mins)**
5. **Conclusion & Future Scalability (1 min)**

---

## 🎬 Script & Action Plan

### 1. Introduction (0:00 - 1:00)

**Visible on Screen:** The Urban Snacks Homepage (Top of page, Hero Section).
**Action:** Slowly pan across the Hero Slider, demonstrating the auto-play and transition. Toggle Light/Dark mode once.

**Voiceover:**
> "Hello! Welcome to the presentation of **Urban Snacks** — a modern, premium e-commerce platform built specifically for authentic Bangladeshi snacks. 
> 
> My goal with this project was to create a buttery-smooth, visually premium shopping experience backed by a highly secure and scalable backend.
>
> On the frontend, we are running **Next.js 16 with the App Router**, styled meticulously using **Tailwind CSS v4** and **Shadcn UI**. For animations, you'll see **Framer Motion** bringing the interface to life.
>
> The backend is powered by **Node.js, Express 5, and Prisma ORM** connected to a **PostgreSQL** database. Let's dive right into the platform."

---

### 2. Public Storefront & UX (1:00 - 3:00)

**Visible on Screen:** Scrolling down the homepage.
**Action:** 
1. Scroll down to show the "Featured Snacks" and "Explore Categories" sections.
2. Hover over product cards to show the subtle scale animations and "Add to Cart" button reveals.
3. Click into a single Product Detail Page.

**Voiceover:**
> "Right from the homepage, the focus is on discovery. Our Hero Slider is completely dynamic and managed by the admin. 
>
> As we scroll, you'll notice the UI feels alive. I used **Framer Motion** for these micro-interactions — like the hover states on our snack cards, which give users immediate feedback.
>
> Let's look at a product detail page. Here, users get all the nutritional details, weight, and even a 'spicy' indicator. The image gallery supports multiple angles, powered by a custom integration with ImgBB for server-side image hosting. 
>
> Notice the sticky 'WhatsApp' button in the corner? That's there universally for instant customer support."

---

### 3. The Shopping Flow & Cart (3:00 - 5:00)

**Visible on Screen:** The Product Page.
**Action:**
1. Click "Add to Cart". 
2. Open the Cart Drawer (slide-out panel). 
3. Increase the quantity of an item.
4. Click "Proceed to Checkout".
5. Fill in dummy shipping details.
6. Apply a coupon code (if you have a test one).
7. Show the Payment Options (COD, Stripe, SSLCommerz).

**Voiceover:**
> "Let's buy some snacks. When I click 'Add to Cart', our slide-out Cart Drawer appears. This state is managed flawlessly on the client-side using **Zustand**, meaning it persists even if the user refreshes the page.
>
> Moving to checkout, I've built a comprehensive multi-step flow. The system automatically calculates delivery charges based on the user's city and applies weight surcharges if the order is heavy.
>
> We also have a fully functional Coupon engine. If I apply a code here, the discount calculates instantly via our server API.
>
> For payments, I've integrated a dual-gateway system. We support **Stripe** for international cards, and **SSLCommerz** specifically for local Bangladeshi payment methods like bKash and Nagad.
>
> Once an order is placed, the user is redirected to a success page, and their order status begins tracking."

---

### 4. Admin Dashboard (5:00 - 8:00)

**Visible on Screen:** The Admin Analytics Dashboard (`/dashboard/admin`).
**Action:**
1. Log in as an Admin (or switch to the admin tab if already logged in).
2. Show the main dashboard charts (Revenue, Orders).
3. Navigate to **Order Management**. Click on an order to show how to change its status (e.g., PLACED to SHIPPED).
4. Navigate to **Item Management**. Briefly show the "Add Product" form highlighting the multi-image upload capability.
5. Navigate to **Banner/Coupon Manager** to show where the homepage content is controlled.

**Voiceover:**
> "Now, let's look behind the curtain. The Admin Dashboard is protected by **Better Auth** using role-based access control. Only verified admins can access this area.
>
> The first thing an admin sees is real-time analytics. Using **Recharts**, we visualize 30-day revenue trends and order volumes, pulling aggregated data from our Express backend.
>
> In the **Order Management** tab, admins track the entire order lifecycle. They can advance an order from 'Placed' to 'Shipped' to 'Delivered', or cancel it. From the user's perspective, they can actually download a dynamically generated PDF invoice using **jsPDF** for these orders.
>
> The dashboard also provides full CRUD operations for our inventory. In **Item Management**, admins can upload multiple images, set weight-based pricing, and assign categories. 
>
> Similarly, they control the active hero banners, create promotional discount coupons, and even moderate customer reviews before they appear publicly."

---

### 5. Conclusion (8:00 - 9:00)

**Visible on Screen:** Return to the Homepage, slowly scrolling.
**Action:** Optional: Show the backend code briefly, highlighting the modular folder structure or the custom QueryBuilder.

**Voiceover:**
> "To tie it all together, Urban Snacks isn't just a frontend UI — it's a completely integrated system. 
>
> On the backend, I built a custom **Advanced Query Engine** that handles complex filtering, pagination, and multi-level sorting, making our API extremely fast and flexible. Every endpoint is strictly validated using **Zod** schema validations.
>
> By combining Next.js Server Actions, TanStack React Query for aggressive caching, and a highly modular Express backend, the platform is robust, secure, and ready to scale.
>
> Thank you for taking the time to tour Urban Snacks!"

---

## 💡 Top Tips for Recording

1. **Pre-load Data:** Make sure your database has at least 5-10 varied products, a few orders in different statuses, and 1 active coupon before you hit record. Empty dashboards don't demo well!
2. **Clear Your Cart:** Start the video with an empty cart to show the fresh addition process.
3. **Pacing:** Don't rush your mouse movements. Move the cursor smoothly to where you want the viewer's eye to go.
4. **Resolution:** Record in at least 1080p so the fine details of your Tailwind design and Shadcn components are crisp.
