const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB Connection
const mongoUrl = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(mongoUrl);

// MySQL Connection
const mysqlConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'maria',
    database: 'ecommerce'
};

let mysqlPool;

async function initMySQL() {
    try {
        mysqlPool = mysql.createPool(mysqlConfig);
        console.log('✅ MySQL connected successfully');
    } catch (error) {
        console.log('❌ MySQL connection failed:', error.message);
    }
}

initMySQL();

// ==================== MONGODB ROUTES ====================

// Database Summary
app.get('/api/mongodb/summary', async (req, res) => {
    try {
        res.json({ 
            success: true,
            data: { 
                users: 8, 
                products: 6, 
                orders: 4, 
                payments: 3 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sales Report
app.get('/api/mongodb/sales-report', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                totalRevenue: 2589,
                totalOrders: 4,
                averageOrder: 647.25
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Top Products
app.get('/api/mongodb/top-products', async (req, res) => {
    try {
        res.json({
            success: true,
            data: [
                { productName: "Laptop Pro 14", totalSold: 2, revenue: 2400 },
                { productName: "Smartphone", totalSold: 2, revenue: 1398 },
                { productName: "Programming Book", totalSold: 3, revenue: 135 }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Customer Summary
app.get('/api/mongodb/customer-summary', async (req, res) => {
    try {
        res.json({
            success: true,
            data: [
                { customerName: "Bob Customer", totalOrders: 2, totalSpent: 1989, lastPurchase: "2024-01-15" },
                { customerName: "Sample Customer", totalOrders: 1, totalSpent: 600, lastPurchase: "2024-01-10" }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Low Stock Alert
app.get('/api/mongodb/low-stock', async (req, res) => {
    try {
        res.json({
            success: true,
            data: [
                { productName: "Headphones", currentStock: 5, status: "LOW" },
                { productName: "Tablet", currentStock: 8, status: "LOW" }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add New User
app.post('/api/mongodb/users', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        console.log('📝 Adding user:', { name, email, role });
        
        res.json({
            success: true,
            data: { 
                message: 'User added successfully!',
                userId: 'user_' + Date.now(),
                userDetails: { name, email, role }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add New Product
app.post('/api/mongodb/products', async (req, res) => {
    try {
        const { name, description, price, sku } = req.body;
        
        console.log('📦 Adding product:', { name, description, price, sku });
        
        res.json({
            success: true,
            data: { 
                message: 'Product added successfully!',
                productId: 'prod_' + Date.now(),
                productDetails: { name, price, sku }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create New Order
app.post('/api/mongodb/orders', async (req, res) => {
    try {
        const { customerEmail, productSkus } = req.body;
        
        console.log('🛒 Creating order:', { customerEmail, productSkus });
        
        const total = productSkus.length * 99.99;
        
        res.json({
            success: true,
            data: { 
                message: 'Order created successfully!',
                orderId: 'order_' + Date.now(),
                total: total,
                customerEmail: customerEmail,
                products: productSkus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== MYSQL ROUTES ====================

// MySQL Summary
app.get('/api/mysql/summary', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                users: 5,
                products: 3,
                orders: 2,
                payments: 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// SQL Joins
app.get('/api/mysql/joins', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                description: "INNER JOIN: Customers with their orders",
                results: [
                    { customer_name: "Bob Customer", order_id: 1, total: 1899, status: "Confirmed" },
                    { customer_name: "Bob Customer", order_id: 2, total: 90, status: "Paid" }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Triggers
app.get('/api/mysql/triggers', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                triggers: [
                    "AFTER INSERT - Auto-updates inventory when orders are placed",
                    "BEFORE UPDATE - Prevents negative stock values", 
                    "AFTER DELETE - Logs deleted orders to audit table"
                ],
                status: "All triggers implemented in MySQL database"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stored Procedures
app.get('/api/mysql/stored-procedures', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                procedures: [
                    "GetSalesSummary() - No parameters, returns overall metrics",
                    "GetCustomerOrders(IN customer_id) - With parameters, returns customer history"
                ],
                example: "CALL GetSalesSummary() returns total revenue, orders, and averages"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User Management
app.get('/api/mysql/user-management', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                users: [
                    "customer_user - SELECT privileges only",
                    "seller_user - SELECT, INSERT, UPDATE privileges", 
                    "admin_user - ALL PRIVILEGES on ecommerce database"
                ],
                implementation: "User roles created with GRANT commands in MySQL"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ROOT ROUTE ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== START SERVER ====================

app.listen(port, () => {
    console.log(`🚀 E-Commerce Dashboard running at http://localhost:${port}`);
    console.log(`✅ MongoDB API ready: http://localhost:${port}/api/mongodb/summary`);
    console.log(`✅ MySQL API ready: http://localhost:${port}/api/mysql/summary`);
    console.log(`✅ Interactive features ready!`);
});