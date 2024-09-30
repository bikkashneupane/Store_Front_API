# Vikiasmy's Watch Haven - Backend

The backend API for [Vikiasmy's Watch Haven](https://vikiasmy.bikashneupane.com), a full-stack e-commerce platform for luxury watches. The backend handles user authentication, order management, and secure payment processing through Stripe.

## Features:

- **User Authentication:** Secure login and registration with JWT-based authentication.
- **Payment Integration:** Stripe API for processing secure payments.
- **Data Validation:** Joi used to validate incoming data requests.
- **Password Encryption:** Bcrypt for encrypting user passwords.
- **MongoDB:** Database to store user data, product information, and orders.

## Tech Stack:

- **Node.js:** Server-side JavaScript runtime.
- **Express:** Fast, minimalist web framework for Node.js.
- **MongoDB:** NoSQL database for storing product and user data.
- **JWT:** JSON Web Tokens for secure authentication.
- **Bcrypt:** Library for hashing passwords.
- **Joi:** Validation library for request validation.
- **Stripe:** Payment gateway for secure transactions.

## Installation:

1. Clone the repository:

   ```bash
      git clone https://github.com/bikkashneupane/Store_Backend
   ```

2. Navigate to the project directory:

   ```bash
      cd Store_Backend
   ```

3. Install dependencies:

   ```bash
      yarn install
   ```

   or

   ```bash
      npm install
   ```

4. Set up environment variables: Create a .env file with the following variables:
   FRONTEND_ROOT
   MONGO_URI
   SALT_ROUND
   SMTP_HOST
   SMTP_SENDER
   SMTP_EMAIL  
   SK_ACCESS
   SK_REFRESH
   STRIPE_SK
   STRIPE_WEBHOOK_ENDPOINT_SECRET
   CLOUDINARY_URL
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET

5. Run the server:

   ```bash
   yarn start
   ```

   or

   ```bash
   npm start
   ```

```

```
