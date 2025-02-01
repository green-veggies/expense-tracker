# 📊 Mini Expense Tracker

An intelligent expense tracker that helps you manage expenses efficiently with insights into your spending patterns. Built with **ReactJS (Frontend), Node.js (Backend), and MongoDB (Database)**, this application ensures a smooth user experience with JWT authentication and real-time expense insights.

---
## 🚀 Approach Taken
### **1️⃣ Authentication & Security**
- Implemented **JWT-based authentication** with HTTP-only cookies for security.
- Protected routes using middleware to ensure only authorized users can manage expenses.

### **2️⃣ Expense Management**
- Users can **add, update, delete, and view expenses** with category-wise filtering and pagination.
- The backend efficiently handles large datasets and supports structured API responses.

### **3️⃣ Intelligent Spending Insights**
- Analyzed total spending per category using aggregation queries.
- Visualized data using **Recharts/MUI X Charts**, enabling users to understand their financial habits.
- Optimized backend queries for **scalability and performance.**

---
## 🔐 JWT Implementation
**Authentication Flow:**
1. **User Signup/Login** → Backend generates a **JWT token**.
2. Token is stored in an **HTTP-only cookie** (prevents XSS attacks).
3. Protected API routes validate the token before processing requests.
4. On logout, the cookie is cleared, ending the session.

**Example JWT Middleware:**
```javascript
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized!" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token!" });
        req.user = decoded;
        next();
    });
};
```

---
## 💰 Expense Management API
### **1️⃣ Add Expense**
```http
POST /expense/add
```
#### **Request Body:**
```json
{
    "amount": 150,
    "category": "Food",
    "date": "2024-02-01",
    "description": "Lunch with friends"
}
```
#### **Response:**
```json
{
    "message": "Expense added successfully!",
    "expense": { "id": "123abc", "amount": 150, "category": "Food" }
}
```

### **2️⃣ Get Expenses (Paginated & Filterable)**
```http
GET /expense/view?page=1&category=Food
```
#### **Response:**
```json
{
    "expenses": [{ "id": "123abc", "amount": 150, "category": "Food" }],
    "total": 10,
    "page": 1
}
```

### **3️⃣ Update Expense**
```http
PUT /expense/update/:id
```
#### **Request Body:**
```json
{
    "amount": 180,
    "category": "Dining"
}
```

### **4️⃣ Delete Expense**
```http
DELETE /expense/delete/:id
```

---
## 📈 Spending Insights API
### **1️⃣ Get Spending Breakdown**
```http
GET /expense/insights
```
#### **Response:**
```json
{
    "totalSpending": 1200,
    "categoryBreakdown": [
        { "category": "Food", "amount": 450, "percentage": 37.5 },
        { "category": "Transport", "amount": 300, "percentage": 25.0 }
    ]
}
```
### **2️⃣ Graphical Visualization**
- **Pie Chart**: Category-wise distribution.
- **Bar Chart**: Monthly spending trends.

---
## 🛠 Tech Stack
- **Frontend**: ReactJS, MUI, Recharts/MUI X Charts
- **Backend**: Node.js/Express (or Python/FastAPI)
- **Database**: MongoDB (Mongoose) / PostgreSQL (Sequelize)
- **Auth**: JWT with HTTP-only cookies

---
## 🌍 Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: AWS / Render / Heroku
- **Database**: MongoDB Atlas / PostgreSQL

---
## 🎯 Conclusion
This Mini Expense Tracker provides a secure, intuitive, and insightful way to manage expenses while keeping a keen eye on spending habits. 🚀💸

👨‍💻 **Contributions & Suggestions Welcome!** 🎉

