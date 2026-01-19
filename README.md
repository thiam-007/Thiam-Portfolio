# Portfolio Cheick Ahmed Thiam - Modern Full Stack Application

## 📋 Description
This project is a high-performance, interactive Portfolio application built with a modern **MERN Stack** (MongoDB, Express, React/Next.js, Node.js). It features a sleek, responsive frontend with advanced animations and a robust custom backend for content management.

Unlike static portfolios, this application includes a fully protected **Admin Dashboard**, allowing the owner to manage Projects, Experiences, Certifications, and Messages dynamically without touching the code.

## 🚀 Technology Stack

### Frontend (Client-Side)
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Data Fetching**: [SWR](https://swr.vercel.app/)
-   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend (Server-Side)
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: TypeScript
-   **Database**: [MongoDB Atlas](https://www.mongodb.com/) w/ Mongoose
-   **Authentication**: JWT (JSON Web Tokens) & Bcrypt
-   **Security**: Helmet, Express-Rate-Limit, HPP, Mongo-Sanitize
-   **Email Service**: Brevo (formerly Sendinblue)

## ✨ Key Features

1.  **Dynamic Content Management**:
    -   CRU(D) operations for Projects, Experiences, and Certifications.
    -   Secure Admin Login.
2.  **Advanced Animations**:
    -   Scroll-triggered reveals.
    -   Staggered grid animations.
    -   Smooth modal transitions.
3.  **SEO & Performance**:
    -   Open Graph & Twitter Cards for social sharing.
    -   Automatic `sitemap.xml` and `robots.txt`.
    -   Lighthouse optimised structure (Semantic HTML).
4.  **Security Best Practices**:
    -   XSS Protection & Security Headers.
    -   Rate Limiting (DDoS protection).
    -   Input Sanitization.

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas Account
-   Brevo Account (for emails)

### 1. Clone the repository
```bash
git clone https://github.com/thiam-007/Thiam-Portfolio.git
cd Thiam-Portfolio
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with your credentials (see .env.example)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local file with NEXT_PUBLIC_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
