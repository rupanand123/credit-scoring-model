# CreditGuard AI 🛡️

**CreditGuard AI** is a comprehensive, full-stack financial technology application designed to empower users with intelligent credit scoring and personalized financial advisory. By combining client-side machine learning with state-of-the-art Generative AI, CreditGuard AI provides a holistic view of a user's financial health.

---

## 🚀 Features

### 1. Intelligent Credit Assessment
- **Instant Predictions**: Get immediate feedback on creditworthiness using advanced Machine Learning.
- **Explainable AI**: Understand the key factors (income, debt, utilization) driving your score.
- **Comprehensive Analysis**: Evaluates 15+ financial parameters including employment status, credit history length, and outstanding debt.

### 2. AI Currency Advisor 💎
- **Personalized Insights**: Receive tailored advice on currency diversification (USD, EUR, GBP, etc.) based on your specific risk profile.
- **Real-Time Grounding**: Powered by **Google Gemini** with **Google Search Grounding** to provide insights based on the latest global exchange rates and economic trends.
- **Actionable Steps**: Get clear, grounded recommendations on how to protect your wealth against inflation and market volatility.

### 3. Interactive Analytics Dashboard
- **Model Performance**: Track the accuracy, precision, and recall of the underlying ML models.
- **Historical Trends**: Visualize your credit journey over time with interactive charts.
- **Data-Driven Insights**: See how your financial habits impact your long-term creditworthiness.

### 4. Secure & Real-Time
- **Firebase Integration**: Secure Google Authentication and real-time data persistence via Firestore.
- **Cross-Device Sync**: Access your predictions and AI recommendations from any device.
- **Error Resilience**: Built-in Error Boundaries and robust Firestore error handling.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (framer-motion)
- **Icons**: [Lucide React](https://lucide.dev/)

### Artificial Intelligence & Machine Learning
- **Generative AI**: [Google Gemini API](https://ai.google.dev/) (`gemini-3-flash-preview`)
- **Search Grounding**: Google Search integration for real-time market data.
- **Client-Side ML**: 
  - `ml-random-forest`
  - `ml-logistic-regression`
  - `ml-cart` (Decision Trees)

### Backend & Infrastructure
- **BaaS**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Server**: [Express](https://expressjs.com/) (Node.js) for local history management and Vite middleware.

### Data Visualization
- **Charts**: [Recharts](https://recharts.org/) for performance metrics and historical data.

---

## 📊 Datasets

### Synthetic Credit Dataset
The core Credit Assessment model is trained on a **Synthetic Dataset** generated programmatically within the application.
- **Size**: 10,000+ simulated financial records.
- **Features**: 
  - Demographics (Age, Education, Marital Status)
  - Employment (Status, Annual Income)
  - Credit Behavior (Utilization, History Length, Delayed Payments)
  - Debt Profile (Outstanding Debt, Total EMI, Loan Amount)
- **Purpose**: This dataset simulates real-world financial patterns to provide a robust training ground for the Random Forest classifier, ensuring high accuracy (94%+) in predicting creditworthiness.

---

## 🛠️ Setup & Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file with your Firebase and Gemini API credentials (see `.env.example`).
4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security
CreditGuard AI implements **Default Deny** Firestore security rules, ensuring that users can only read and write their own data. All AI recommendations are grounded in verified web sources to prevent hallucinations.

---
*Developed with ❤️ for intelligent financial freedom.*
