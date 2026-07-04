# 🚗 RideEasy – Vehicle Rental Platform

RideEasy is a full-stack web-based vehicle rental platform designed to simplify the process of renting vehicles such as cars, bikes, and scooters.

The platform connects customers with vehicle owners and rental service providers through a centralized digital system. Users can search for available vehicles, compare rental options, check pricing, select rental dates, book vehicles, and make secure online payments.

Vehicle providers can manage their vehicle listings, track availability, manage bookings, and monitor rental activity through a dedicated provider dashboard.

The platform also includes an admin dashboard for managing users, providers, vehicle listings, bookings, and platform activities.

---

## 📌 Project Overview

Traditional vehicle rental systems often depend on manual booking processes, phone calls, and physical visits to rental agencies. These systems may have limited visibility into vehicle availability and inefficient booking management.

RideEasy provides a centralized digital solution that allows customers to discover and rent vehicles online while helping vehicle providers efficiently manage their rental business.

The main objective of RideEasy is to improve rental convenience, booking efficiency, vehicle availability tracking, and the overall digital experience for customers and rental service providers.

---

## ✨ Features

### 👤 Customer Features

- User Registration and Login
- Secure JWT Authentication
- Browse Available Vehicles
- Search Vehicles by Location
- Filter Vehicles by Type, Price, Brand, and Fuel Type
- View Vehicle Details
- Check Vehicle Availability
- Select Rental Start and End Dates
- Book Vehicles Online
- Secure Online Payment
- View Booking History
- Cancel Bookings
- Track Booking Status
- Rate and Review Vehicles
- Receive Booking Notifications
- Manage User Profile

### 🚗 Vehicle Provider Features

- Provider Registration and Login
- Provider Dashboard
- Add New Vehicles
- Upload Vehicle Images
- Edit Vehicle Information
- Delete Vehicle Listings
- Manage Vehicle Availability
- Set Hourly and Daily Rental Prices
- View Customer Bookings
- Manage Booking Status
- Track Rental History
- View Vehicle Reviews
- Monitor Earnings and Rental Statistics
- Manage Provider Profile

### 🛡️ Admin Features

- Secure Admin Login
- Admin Dashboard
- Manage Customers
- Manage Vehicle Providers
- Approve or Reject Vehicle Listings
- Manage Vehicle Listings
- Monitor All Bookings
- Monitor Payments
- Manage Reviews
- Block or Remove Users
- View Platform Statistics
- Manage Platform Activities

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcrypt
- Role-Based Access Control

### Image Management

- Cloudinary

### Payment Gateway

- Razorpay

### Email & Notifications

- Nodemailer

### Deployment

- Vercel – Frontend
- Render / Cloud Server – Backend
- MongoDB Atlas – Database

---

## 🏗️ System Architecture

The RideEasy platform follows a client-server architecture.

    React Frontend
          |
          | HTTP / REST API
          |
          v
    Node.js + Express.js
          |
          | Mongoose
          |
          v
       MongoDB

External services are integrated with the backend.

    React Application
          |
          v
    Express Backend
       /    |     \
      /     |      \
MongoDB  Cloudinary  Razorpay

---

## 👥 User Roles

RideEasy contains three main user roles.

| Role | Description |
|------|-------------|
| Customer | Searches, books, and rents vehicles |
| Vehicle Provider | Lists and manages rental vehicles |
| Admin | Manages the entire platform |

Role-based authorization ensures users can only access features related to their assigned role.

---

## 📦 Project Modules

The RideEasy system contains the following modules:

1. User Registration Module
2. User Authentication Module
3. Vehicle Listing Management
4. Vehicle Search Module
5. Vehicle Filter Module
6. Vehicle Details Module
7. Vehicle Availability Tracking
8. Booking Management System
9. Payment Integration
10. Booking History
11. Rental Management
12. Booking Cancellation
13. Rating and Review System
14. Notification System
15. Provider Dashboard
16. Admin Dashboard

---

## 🔐 Authentication Flow

    User Login
         |
         v
    Enter Email & Password
         |
         v
    Express API
         |
         v
    MongoDB User Verification
         |
         v
    bcrypt Password Verification
         |
         v
    JWT Token Generated
         |
         v
    User Authenticated

JWT tokens are used to access protected routes.

---

## 🚘 Vehicle Management

Vehicle providers can add and manage vehicles.

Each vehicle contains information such as:

- Vehicle Name
- Brand
- Model
- Vehicle Type
- Fuel Type
- Transmission Type
- Number of Seats
- Hourly Rental Price
- Daily Rental Price
- Location
- Registration Number
- Vehicle Description
- Vehicle Images
- Availability Status
- Average Rating

Vehicle images are uploaded to Cloudinary and the generated image URLs are stored in MongoDB.

---

## 🔍 Vehicle Search and Filtering

Customers can search vehicles based on:

- Location
- Vehicle Type
- Pickup Date
- Return Date

Available filters include:

- Vehicle Type
- Price Range
- Brand
- Fuel Type
- Transmission
- Rating
- Number of Seats
- Location

Only vehicles available during the selected rental period are displayed.

---

## 📅 Vehicle Availability System

RideEasy prevents multiple customers from booking the same vehicle for overlapping rental dates.

The system checks existing bookings before confirming a new booking.

### Booking Overlap Logic

    Existing Start Date <= New End Date
                 AND
    Existing End Date >= New Start Date

If both conditions are true, the selected vehicle is already booked for the requested rental period.

Example:

    Existing Booking
    10 July -------- 12 July

    New Booking
         11 July -------- 13 July

    Result: Booking Conflict ❌

The vehicle will not be available for the selected dates.

---

## 📖 Booking Workflow

    Customer Searches Vehicle
              |
              v
       Selects Vehicle
              |
              v
       Selects Rental Dates
              |
              v
      Availability Verification
              |
              v
       Rental Price Calculation
              |
              v
         Booking Created
              |
              v
        Payment Initiated
              |
              v
        Payment Successful
              |
              v
        Booking Confirmed

---

## 💳 Payment Integration

RideEasy uses Razorpay for secure online payment processing.

### Payment Flow

    Customer Clicks Pay
             |
             v
    React Sends Payment Request
             |
             v
       Express Backend
             |
             v
     Razorpay Order Created
             |
             v
    Razorpay Checkout Opens
             |
             v
       Customer Completes Payment
             |
             v
     Payment Signature Verification
             |
             v
        Booking Confirmed

Payment verification is performed on the backend for improved security.

The system stores:

- Razorpay Order ID
- Razorpay Payment ID
- Payment Amount
- Payment Status
- Booking ID

---

## ⭐ Rating and Review System

Customers can rate and review vehicles after completing a rental.

Only customers with a completed booking are allowed to submit a review.

Ratings range from:

⭐ 1 Star – Poor

⭐⭐ 2 Stars – Fair

⭐⭐⭐ 3 Stars – Good

⭐⭐⭐⭐ 4 Stars – Very Good

⭐⭐⭐⭐⭐ 5 Stars – Excellent

The average rating is displayed on the vehicle details page.

---

## 🔔 Notification System

RideEasy provides notifications for important activities.

Notification types include:

- Booking Confirmed
- Payment Successful
- Booking Cancelled
- New Booking Received
- Vehicle Approved
- Vehicle Rejected
- Rental Reminder

Notifications are stored in MongoDB and displayed in the user dashboard.

---

## 🗄️ Database Collections

The RideEasy database contains the following MongoDB collections:

### Users

Stores customer, provider, and admin information.

### Vehicles

Stores vehicle details and provider information.

### Bookings

Stores rental booking information.

### Payments

Stores payment transaction details.

### Reviews

Stores customer ratings and reviews.

### Notifications

Stores system and booking notifications.

### Availability

Stores vehicle unavailable periods.

### Cancellations

Stores booking cancellation and refund information.

---

## 📁 Project Structure

    RideEasy/
    |
    ├── client/
    │   |
    │   └── src/
    │       |
    │       ├── components/
    │       │   ├── Navbar.jsx
    │       │   ├── Footer.jsx
    │       │   ├── VehicleCard.jsx
    │       │   ├── SearchBar.jsx
    │       │   └── ProtectedRoute.jsx
    │       |
    │       ├── pages/
    │       │   ├── Home.jsx
    │       │   ├── Login.jsx
    │       │   ├── Register.jsx
    │       │   ├── SearchVehicles.jsx
    │       │   ├── VehicleDetails.jsx
    │       │   ├── Checkout.jsx
    │       │   ├── MyBookings.jsx
    │       │   └── Profile.jsx
    │       |
    │       ├── provider/
    │       │   ├── ProviderDashboard.jsx
    │       │   ├── MyVehicles.jsx
    │       │   ├── AddVehicle.jsx
    │       │   └── ProviderBookings.jsx
    │       |
    │       ├── admin/
    │       │   ├── AdminDashboard.jsx
    │       │   ├── ManageUsers.jsx
    │       │   ├── ManageVehicles.jsx
    │       │   └── ManageBookings.jsx
    │       |
    │       ├── services/
    │       │   └── api.js
    │       |
    │       ├── App.jsx
    │       └── main.jsx
    |
    ├── server/
    │   |
    │   ├── config/
    │   │   ├── db.js
    │   │   └── cloudinary.js
    │   |
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Vehicle.js
    │   │   ├── Booking.js
    │   │   ├── Payment.js
    │   │   ├── Review.js
    │   │   └── Notification.js
    │   |
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── vehicleController.js
    │   │   ├── bookingController.js
    │   │   ├── paymentController.js
    │   │   └── adminController.js
    │   |
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── vehicleRoutes.js
    │   │   ├── bookingRoutes.js
    │   │   ├── paymentRoutes.js
    │   │   └── adminRoutes.js
    │   |
    │   ├── middleware/
    │   │   ├── authMiddleware.js
    │   │   ├── roleMiddleware.js
    │   │   └── errorMiddleware.js
    │   |
    │   ├── utils/
    │   │   └── sendEmail.js
    │   |
    │   └── server.js
    |
    ├── .gitignore
    └── README.md

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/search` | Search vehicles |
| GET | `/api/vehicles/:id` | Get vehicle details |
| POST | `/api/vehicles` | Add vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get booking history |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| POST | `/api/payment/order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |
| POST | `/api/reviews` | Add vehicle review |
| GET | `/api/provider/dashboard` | Provider dashboard |
| GET | `/api/admin/dashboard` | Admin dashboard |

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>