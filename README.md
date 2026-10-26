# SHtodio — Kids Fitness Studio

A full-stack web application for a children's fitness studio, built to make sports accessible, enjoyable, and non-competitive.

## Technical Overview

- **Frontend:** React, TypeScript, React Router, Vite, HTML and CSS.
- **Backend:** Node.js and Express, exposing REST API endpoints for clients, lessons, registrations, and products.
- **Database:** SQLite with Prisma ORM for database queries, relationships, and data persistence.
- **Authentication:** Account creation and login with bcrypt password hashing; login state stored in localStorage.
- **Data Flow:** The frontend uses `fetch` to communicate with the backend over HTTP. Express handles requests, Prisma accesses the database, and responses are returned as JSON.
- **UI & Assets:** Reusable React components, CSS design system, responsive layouts, and locally imported product images.
- **Development Tools:** Git, GitHub, npm, Prisma Studio, AI and Vite.

## How SHtodio Works

Parents can explore the studio's classes and weekly schedule, create an account, or log in with an existing account. **Only logged-in users can register for classes.** If a visitor tries to register without an account, they are directed to the login page and can create an account before continuing the registration process.

Each registration is stored in the database and linked to both the client and the selected class. The backend checks that the client and class exist and prevents duplicate registrations for the same class. Registered classes can then be viewed in the personal area.

**Demo mode:** Class registration is currently available without credit card details or real payment processing because the application is not yet connected to a real studio.

The shop displays studio products with image galleries and color selection. Product information is retrieved from the backend, while product images are imported from the frontend assets.

## Demo Videos

### 1. From Visitor to Class Registration

Demonstrates the complete user journey: attempting to register while logged out, creating an account, continuing to class registration, and attempting to register for the same class again to demonstrate duplicate prevention.


https://github.com/user-attachments/assets/4dadd8c2-2bc2-4880-bbbf-c9249ddce9a2




### 2. Exploring the Shop

Demonstrates browsing products, opening a product details page, navigating between images, and switching product colors.

![Product shop demo](docs/demos/product-shop.gif)

## Future Improvements

- Shopping cart and checkout.
- Payment integration with a real studio.
- Automated tests.
