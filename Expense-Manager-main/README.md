# Expense Manager

## Overview
Expense Manager is a comprehensive personal finance application designed to help users track their income and expenses, manage budgets, and gain insights into their spending habits. The application provides an intuitive interface for managing financial transactions, visualizing spending patterns, and maintaining a clear view of your financial health.

## Video Demonstration
[Watch Demo Video](https://drive.google.com/file/d/1U1a7Kn6y_29YPiY8VhSJi6gCEFWm0-Em/view?usp=sharing)

## Glimpses of the App

![Dashboard](https://drive.google.com/uc?export=view&id=1CFjJVT9tiooAlDLzW8Z27PEPK0hmatkA)

![Transactions](https://drive.google.com/uc?export=view&id=1lClZ3yVsgcUl_9uF4PTAIqeNAebHceEe)

![Charts](https://drive.google.com/uc?export=view&id=1pWQxYkP9bek1UoH2sGyd27SN1bWfUtgV)

![Mobile View](https://drive.google.com/uc?export=view&id=15LA47krPmolf2Leyn05Iv2PY4AmknZFl)

![Receipt Processing](https://drive.google.com/uc?export=view&id=1qC6qAYXNmLPAHu9-Wwd-wJ9jjPgKZETk)

## Features

### User Authentication
- Secure registration and login system
- JWT-based authentication

### Dashboard
- Monthly budget overview with fixed budget (₹1,00,000)
- Income and expense summaries
- Visual representations of financial data
- Recent transactions display

### Transaction Management
- Add, edit, and delete income and expense transactions
- Categorize transactions
- Filter transactions by type, category, date range, and amount
- Receipt upload and processing using AI
- Transaction history import

### Reports and Visualizations
- Category-based pie charts for income and expenses
- Timeline charts showing income vs. expenses
- Top expense categories analysis

### User Experience
- Responsive design for all device sizes
- Beautiful dark-themed UI with gradient accents
- Toast notifications for user feedback
- Custom modal confirmations for important actions

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose for data storage
- **Passport.js** with JWT for authentication
- **Multer** for file uploads
- **Google Generative AI** for receipt processing

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key (for receipt processing)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   URL=your_mongodb_connection_string
   SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_BACKEND_BASE_URL=http://localhost:5001
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

### Backend
- `index.js` - Entry point for the Express server
- `models/` - MongoDB schema definitions
- `routes/` - API route handlers
- `utils/` - Helper functions and utilities
- `uploads/` - Directory for storing uploaded files

### Frontend
- `src/api/` - API service functions
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/types/` - TypeScript type definitions
- `src/assets/` - Static assets
- `src/data/` - Static data (like category lists)

## Usage Guide

1. **Register/Login**: Create a new account or login with existing credentials
2. **Dashboard**: View your financial overview with income, expenses, and budget information
3. **Transactions**: Add new transactions, upload receipts, or import transaction history
4. **Filter & Search**: Use the filter options to find specific transactions
5. **Reports**: Analyze your spending patterns through various charts and visualizations