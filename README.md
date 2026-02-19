# 🏢 Enterprise ERP & Inventory Management System

**Live Demo:**  
👉 https://inventory-mgmt-dashboard.netlify.app/

_This is a working demo website showcasing my frontend and full-stack development capabilities through a production-grade ERP dashboard application._

**Project Started:** November 1, 2025  
**Version:** 2.0.2  

---

## 📌 Overview

This project is a modern, enterprise-oriented **ERP (Enterprise Resource Planning) Dashboard** built using React, TypeScript, Vite, and Tailwind CSS.

It is designed as a scalable, modular business management system integrating multiple operational domains such as Sales, Purchase, Finance, Inventory, POS, and Reporting — all within a unified interface.

The application demonstrates advanced UI engineering, modular architecture, reusable data tables, dynamic role management, and multi-tab navigation systems similar to professional ERP platforms.

---

## 🏢 Multi-Module ERP Architecture

The system is structured as a unified application containing multiple business modules:

- 📈 Sales Management  
- 🛒 Purchase Management  
- 💰 Finance & Accounting  
- 📦 Inventory Management  
- 🧾 Point of Sale (POS)  
- 🏭 Production Management  
- 🏢 Asset Tracking  
- 🌐 E-commerce Module  
- 👥 Employee Management  
- 📊 Reporting & Analytics  

Each module operates independently while sharing:

- Centralized authentication
- Dynamic role-based access control
- Unified UI component system
- Shared table engine & export utilities

---

## 🧠 Key Features

### 🔐 Authentication & Role System
- Secure login system
- Dynamic multi-role management controlled by Admin
- Role-based feature access
- Protected routes architecture

### 🗂 ERP-Style Tab System
- Multi-tab navigation within a single page
- No URL path changes while switching modules
- Multiple tabs can remain open simultaneously
- Stateful tab lifecycle management

### 📊 Advanced Data Tables
- Reusable table engine
- Sorting, filtering, pagination
- Column drag & drop reordering
- Resizable columns
- Bulk selection & delete
- Export to CSV / Excel
- Printable views

### 📈 Visualization & Reporting
- Real-time charts (ApexCharts & Recharts)
- World map visualization
- Financial & analytical dashboards

### 📆 Scheduling & Interaction
- FullCalendar integration
- Drag-and-drop functionality
- Dynamic event handling

### 📦 Inventory Capabilities
- Item Master
- Stock Adjustments
- Inter Branch Transfers
- POS Invoice support
- QR Code generation

### 🔊 Smart UX Enhancements
- Time-based dynamic greeting using Web Speech API  
  _Example: “Good Morning, Prince Kumar”_
- Smooth animations via Framer Motion
- Custom scrollbars and UI transitions

---

## 🧰 Tech Stack

### ⚛️ Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- clsx
- tailwind-merge
- tailwind-scrollbar

### 📊 Charts & Visualization
- ApexCharts
- React ApexCharts
- Recharts
- @react-jvectormap/core
- @react-jvectormap/world

### 🧩 UI & Interaction
- Lucide React
- React Icons
- Framer Motion
- SimpleBar
- Swiper

### 📅 Calendar & Drag-Drop
- FullCalendar (Core, DayGrid, TimeGrid, List, Interaction)
- @hello-pangea/dnd
- react-dnd
- react-dnd-html5-backend

### 📦 Utilities & Data Handling
- Axios
- Firebase
- UUID
- to-words
- html2pdf.js
- xlsx

### 🛣 Navigation & SEO
- React Router v7
- React Helmet Async

### 🛠 Development Tools
- ESLint
- TypeScript
- Vite
- PostCSS
- Autoprefixer

---

## 🧱 Architectural Highlights

- Modular folder structure
- Scalable component-driven architecture
- Reusable table logic hooks
- Separation of business logic & UI
- Centralized service layer for API integration
- ERP-like multi-domain scalability

---

## 📁 Project Structure

```
src/
 ├── assets/
 ├── components/
 ├── context/
 ├── hooks/
 ├── modules/
 │    ├── sales/
 │    ├── purchase/
 │    ├── finance/
 │    ├── inventory/
 │    ├── pos/
 │    ├── production/
 │    ├── assets/
 │    ├── ecommerce/
 │    └── reports/
 ├── services/
 ├── utils/
 └── App.tsx
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup

```bash
git clone <your-repository-url>
cd inventory
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔐 Security Notes

- No passwords stored in browser storage
- Token-based authentication
- Protected route implementation
- API validation handled on backend services

---

## 📈 Performance Optimization

- Vite fast build & hot reload
- Optimized rendering
- Component modularization
- Efficient pagination & data slicing
- Controlled re-renders using memoization

---

## 🎯 Purpose

This project is built as a professional demonstration of:

- Enterprise-level UI architecture
- ERP-style system design
- Scalable frontend engineering
- Multi-module dashboard development
- Advanced React + TypeScript implementation

---

## 👨‍💻 Author

**Prince Kumar**  
Full Stack Developer  

GitHub: https://github.com/<your-username>  
LinkedIn: https://linkedin.com/in/<your-username>  

---

## 📄 License

This project is created for portfolio and demonstration purposes.
