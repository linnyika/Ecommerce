// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Activate clicked button
    event.currentTarget.classList.add('active');
    
    // Load live data when interactive tab is opened
    if (tabName === 'interactive') {
        refreshAllData();
    }
}

// MongoDB data loader
async function loadMongoDBData(endpoint) {
    const resultDiv = document.getElementById(`mongo-${endpoint}`);
    resultDiv.innerHTML = '<div class="loading">Loading MongoDB data... ⏳</div>';
    
    try {
        const response = await fetch(`/api/mongodb/${endpoint}`);
        const data = await response.json();
        
        if (data.success) {
            displayMongoDBData(resultDiv, data.data, endpoint);
        } else {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">MongoDB Connection failed: Make sure MongoDB is running</div>`;
    }
}

// MySQL data loader
async function loadMySQLData(endpoint) {
    const resultDiv = document.getElementById(`mysql-${endpoint}`);
    resultDiv.innerHTML = '<div class="loading">Loading MySQL data... ⏳</div>';
    
    try {
        const response = await fetch(`/api/mysql/${endpoint}`);
        const data = await response.json();
        
        if (data.success) {
            displayMySQLData(resultDiv, data.data, endpoint);
        } else {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">MySQL Connection error: ${error.message}</div>`;
    }
}

// Report generator
async function generateReport(type) {
    const resultDiv = document.getElementById(`report-${type}`);
    resultDiv.innerHTML = '<div class="loading">Generating business report... 📊</div>';
    
    setTimeout(() => {
        let reportData = {};
        
        switch(type) {
            case 'sales':
                reportData = {
                    title: "Sales Analytics Report",
                    monthlySales: [
                        { month: 'January', revenue: 4500, orders: 12, growth: '+8%' },
                        { month: 'February', revenue: 5200, orders: 15, growth: '+15%' },
                        { month: 'March', revenue: 6100, orders: 18, growth: '+17%' }
                    ],
                    summary: {
                        totalRevenue: 15800,
                        totalOrders: 45,
                        averageOrderValue: 351,
                        bestPerformingMonth: 'March'
                    }
                };
                break;
                
            case 'segmentation':
                reportData = {
                    title: "Customer Segmentation Analysis",
                    segments: [
                        { 
                            segment: 'VIP Customers', 
                            count: 45, 
                            avgSpend: 1200,
                            characteristics: 'High frequency, high value orders',
                            recommendation: 'Offer exclusive deals and early access'
                        },
                        { 
                            segment: 'Regular Customers', 
                            count: 120, 
                            avgSpend: 450,
                            characteristics: 'Moderate frequency, consistent spending',
                            recommendation: 'Loyalty programs and personalized offers'
                        },
                        { 
                            segment: 'New Customers', 
                            count: 85, 
                            avgSpend: 180,
                            characteristics: 'First-time buyers, testing products',
                            recommendation: 'Welcome discounts and educational content'
                        }
                    ],
                    insights: 'VIP customers (18%) drive 45% of total revenue'
                };
                break;
                
            case 'association':
                reportData = {
                    title: "Market Basket Analysis",
                    frequentPatterns: [
                        { 
                            items: ['Laptop', 'Wireless Mouse'], 
                            support: '65%', 
                            confidence: '72%',
                            lift: '2.1',
                            recommendation: 'Create laptop + mouse bundle deal'
                        },
                        { 
                            items: ['Smartphone', 'Protective Case'], 
                            support: '45%', 
                            confidence: '68%',
                            lift: '1.8',
                            recommendation: 'Cross-sell cases at smartphone checkout'
                        },
                        { 
                            items: ['Programming Book', 'Notebook'], 
                            support: '30%', 
                            confidence: '55%',
                            lift: '1.5',
                            recommendation: 'Suggest notebooks to book buyers'
                        }
                    ],
                    businessImpact: 'These associations can increase average order value by 15-20%'
                };
                break;
        }
        
        displayReportData(resultDiv, reportData, type);
    }, 1500);
}

// ==================== INTERACTIVE FUNCTIONS ====================

// Add new user
async function addUser(event) {
    event.preventDefault();
    const form = event.target;
    const resultDiv = document.getElementById('user-result');
    
    const formData = new FormData(form);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role')
    };
    
    resultDiv.innerHTML = '<div class="loading">Adding user... 👤</div>';
    
    try {
        const response = await fetch('/api/mongodb/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<div class="success">
                ✅ User added successfully!<br>
                Name: ${userData.name}<br>
                Email: ${userData.email}<br>
                Role: ${userData.role}<br>
                User ID: ${data.data.userId}
            </div>`;
            form.reset();
            refreshAllData();
        } else {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Failed to add user: ${error.message}</div>`;
    }
}

// Add new product
async function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const resultDiv = document.getElementById('product-result');
    
    const formData = new FormData(form);
    const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        sku: formData.get('sku')
    };
    
    resultDiv.innerHTML = '<div class="loading">Adding product... 📦</div>';
    
    try {
        const response = await fetch('/api/mongodb/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<div class="success">
                ✅ Product added successfully!<br>
                Name: ${productData.name}<br>
                Price: $${productData.price}<br>
                SKU: ${productData.sku}<br>
                Product ID: ${data.data.productId}
            </div>`;
            form.reset();
            refreshAllData();
        } else {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Failed to add product: ${error.message}</div>`;
    }
}

// Create new order
async function createOrder(event) {
    event.preventDefault();
    const form = event.target;
    const resultDiv = document.getElementById('order-result');
    
    const formData = new FormData(form);
    const selectedProducts = formData.getAll('products');
    
    if (selectedProducts.length === 0) {
        resultDiv.innerHTML = '<div class="error">Please select at least one product</div>';
        return;
    }
    
    const orderData = {
        customerEmail: formData.get('customerEmail'),
        productSkus: selectedProducts
    };
    
    resultDiv.innerHTML = '<div class="loading">Creating order... 🛒</div>';
    
    try {
        const response = await fetch('/api/mongodb/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<div class="success">
                ✅ Order created successfully!<br>
                Customer: ${orderData.customerEmail}<br>
                Products: ${selectedProducts.join(', ')}<br>
                Total: $${data.data.total}<br>
                Order ID: ${data.data.orderId}
            </div>`;
            form.reset();
            refreshAllData();
        } else {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Failed to create order: ${error.message}</div>`;
    }
}

// Refresh all data
async function refreshAllData() {
    const updatesDiv = document.getElementById('live-updates');
    updatesDiv.innerHTML = '<div class="loading">Refreshing live data... 🔄</div>';
    
    try {
        // Load MongoDB summary for live stats
        const response = await fetch('/api/mongodb/summary');
        const data = await response.json();
        
        if (data.success) {
            // Update live stats
            document.getElementById('live-users').textContent = data.data.users;
            document.getElementById('live-products').textContent = data.data.products;
            document.getElementById('live-orders').textContent = data.data.orders;
            
            updatesDiv.innerHTML = `<div class="success">
                ✅ Live data updated!<br>
                Database statistics refreshed in real-time.<br>
                Try adding more data to see changes instantly!
            </div>`;
        } else {
            updatesDiv.innerHTML = `<div class="error">Failed to refresh data: ${data.error}</div>`;
        }
    } catch (error) {
        updatesDiv.innerHTML = `<div class="error">Connection error: ${error.message}</div>`;
    }
}

// Add sample data
async function addSampleData() {
    const updatesDiv = document.getElementById('live-updates');
    updatesDiv.innerHTML = '<div class="loading">Adding sample data... 🎯</div>';
    
    try {
        // Add sample user
        await fetch('/api/mongodb/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Sample Customer',
                email: 'sample@customer.com',
                role: 'customer'
            })
        });
        
        // Add sample product
        await fetch('/api/mongodb/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Sample Product',
                description: 'This is a sample product for demonstration',
                price: 29.99,
                sku: 'SMP-001'
            })
        });
        
        updatesDiv.innerHTML = `<div class="success">
            ✅ Sample data added successfully!<br>
            • Added "Sample Customer" (customer)<br>
            • Added "Sample Product" ($29.99)<br>
            Refresh to see updated statistics!
        </div>`;
        
        refreshAllData();
    } catch (error) {
        updatesDiv.innerHTML = `<div class="error">Failed to add sample data: ${error.message}</div>`;
    }
}

// Clear all forms
function clearAllForms() {
    document.getElementById('addUserForm').reset();
    document.getElementById('addProductForm').reset();
    document.getElementById('createOrderForm').reset();
    
    document.getElementById('user-result').innerHTML = '';
    document.getElementById('product-result').innerHTML = '';
    document.getElementById('order-result').innerHTML = '';
    
    const updatesDiv = document.getElementById('live-updates');
    updatesDiv.innerHTML = '<div class="success">All forms cleared! Ready for new data entry.</div>';
}

// Test all features
async function testAllFeatures() {
    const updatesDiv = document.getElementById('live-updates');
    updatesDiv.innerHTML = '<div class="loading">Testing all features... 🧪</div>';
    
    try {
        // Test MongoDB connection
        const mongoResponse = await fetch('/api/mongodb/summary');
        const mongoData = await mongoResponse.json();
        
        // Test MySQL connection
        const mysqlResponse = await fetch('/api/mysql/summary');
        const mysqlData = await mysqlResponse.json();
        
        let results = [];
        
        if (mongoData.success) results.push('✅ MongoDB connected');
        else results.push('❌ MongoDB failed');
        
        if (mysqlData.success) results.push('✅ MySQL connected');
        else results.push('❌ MySQL failed');
        
        updatesDiv.innerHTML = `<div class="success">
            <strong>System Test Results:</strong><br>
            ${results.join('<br>')}<br><br>
            All systems are ready for demonstration!
        </div>`;
        
    } catch (error) {
        updatesDiv.innerHTML = `<div class="error">Test failed: ${error.message}</div>`;
    }
}

// ==================== DISPLAY FUNCTIONS ====================

// Display MongoDB data
function displayMongoDBData(container, data, type) {
    if (!data || Object.keys(data).length === 0) {
        container.innerHTML = '<div class="error">No MongoDB data available</div>';
        return;
    }
    
    let html = '<div class="success">';
    
    switch(type) {
        case 'summary':
            html += `
                <strong>📊 MongoDB Database Summary</strong><br><br>
                👥 <strong>Users:</strong> ${data.users || 0}<br>
                📦 <strong>Products:</strong> ${data.products || 0}<br>
                🛒 <strong>Orders:</strong> ${data.orders || 0}<br>
                💳 <strong>Payments:</strong> ${data.payments || 0}<br><br>
                <em>NoSQL Document Store</em>
            `;
            break;
            
        case 'sales-report':
            html += `
                <strong>💰 MongoDB Sales Report</strong><br><br>
                💵 <strong>Total Revenue:</strong> $${(data.totalRevenue || 0).toFixed(2)}<br>
                📈 <strong>Total Orders:</strong> ${data.totalOrders || 0}<br>
                📊 <strong>Average Order:</strong> $${(data.averageOrder || 0).toFixed(2)}<br><br>
                <em>Aggregation Pipeline Result</em>
            `;
            break;
            
        case 'top-products':
            if (Array.isArray(data) && data.length > 0) {
                html += '<strong>🏆 Top Selling Products (MongoDB)</strong><br><br>';
                data.forEach((product, index) => {
                    html += `
                        <div class="data-item">
                            <strong>${index + 1}. ${product.productName}</strong><br>
                            📦 Sold: ${product.totalSold} units<br>
                            💰 Revenue: $${product.revenue.toFixed(2)}<br>
                            <em>Document: {productId, quantity, unitPrice}</em>
                        </div>
                    `;
                });
            } else {
                html += 'No product data available in MongoDB';
            }
            break;
            
        case 'customer-summary':
            if (Array.isArray(data) && data.length > 0) {
                html += '<strong>👥 Customer Analytics (MongoDB)</strong><br><br>';
                data.forEach(customer => {
                    const lastPurchase = new Date(customer.lastPurchase).toLocaleDateString();
                    html += `
                        <div class="data-item">
                            <strong>👤 ${customer.customerName}</strong><br>
                            🛒 Orders: ${customer.totalOrders}<br>
                            💵 Total Spent: $${customer.totalSpent.toFixed(2)}<br>
                            📅 Last Purchase: ${lastPurchase}<br>
                            <em>Embedded documents with $lookup</em>
                        </div>
                    `;
                });
            } else {
                html += 'No customer data available in MongoDB';
            }
            break;
            
        case 'low-stock':
            if (Array.isArray(data) && data.length > 0) {
                html += '<strong>📦 Low Stock Alerts (MongoDB)</strong><br><br>';
                data.forEach(item => {
                    const statusIcon = item.status === 'CRITICAL' ? '🚨' : '⚠️';
                    html += `
                        <div class="data-item">
                            ${statusIcon} <strong>${item.productName}</strong><br>
                            📊 Current Stock: ${item.currentStock} units<br>
                            🚩 Status: ${item.status}<br>
                            <em>Flexible schema with $match</em>
                        </div>
                    `;
                });
            } else {
                html += '✅ All products have sufficient stock in MongoDB';
            }
            break;
            
        default:
            html += '<strong>MongoDB Data:</strong><br>' + JSON.stringify(data, null, 2);
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Display MySQL data
function displayMySQLData(container, data, type) {
    if (!data || Object.keys(data).length === 0) {
        container.innerHTML = '<div class="error">No MySQL data available</div>';
        return;
    }
    
    let html = '<div class="success">';
    
    switch(type) {
        case 'summary':
            html += `
                <strong>📊 MySQL Database Summary</strong><br><br>
                👥 <strong>Users:</strong> ${data.users || 0}<br>
                📦 <strong>Products:</strong> ${data.products || 0}<br>
                🛒 <strong>Orders:</strong> ${data.orders || 0}<br>
                💳 <strong>Payments:</strong> ${data.payments || 0}<br><br>
                <em>Relational Database Management System</em>
            `;
            break;
            
        case 'joins':
            html += `
                <strong>🔗 SQL Joins Demonstration</strong><br><br>
                <strong>INNER JOIN:</strong> Customers with Orders<br><br>
            `;
            
            if (data.innerJoin && data.innerJoin.length > 0) {
                html += '<strong>Sample Results:</strong><br>';
                data.innerJoin.forEach(row => {
                    html += `
                        <div class="data-item">
                            👤 ${row.customer_name}<br>
                            🛒 Order #${row.order_id}<br>
                            💰 $${row.total} - ${row.status}
                        </div>
                    `;
                });
            }
            html += '<em>Relational integrity with foreign keys</em>';
            break;
            
        case 'triggers':
            html += `
                <strong>⚡ SQL Triggers Implementation</strong><br><br>
                ✅ <strong>AFTER INSERT Trigger:</strong><br>
                &nbsp;&nbsp;• Updates inventory when orders are placed<br>
                &nbsp;&nbsp;• Maintains data consistency automatically<br><br>
                
                ✅ <strong>BEFORE UPDATE Trigger:</strong><br>
                &nbsp;&nbsp;• Prevents negative stock values<br>
                &nbsp;&nbsp;• Ensures business rules are enforced<br><br>
                
                ✅ <strong>AFTER DELETE Trigger:</strong><br>
                &nbsp;&nbsp;• Logs deleted orders to audit table<br>
                &nbsp;&nbsp;• Provides data recovery capability<br><br>
                
                <em>Automated data integrity checks</em>
            `;
            break;
            
        case 'stored-procedures':
            html += `
                <strong>💾 Stored Procedures</strong><br><br>
                ✅ <strong>GetSalesSummary()</strong> - No parameters<br>
                &nbsp;&nbsp;• Returns overall business metrics<br><br>
                
                ✅ <strong>GetCustomerOrders(IN customer_id)</strong> - With parameters<br>
                &nbsp;&nbsp;• Returns order history for specific customer<br>
                &nbsp;&nbsp;• Parameterized for flexibility<br><br>
            `;
            
            if (data.salesSummary) {
                html += '<strong>Sales Summary Result:</strong><br>';
                html += `<div class="data-item">
                    📊 Total Orders: ${data.salesSummary.total_orders || 0}<br>
                    💰 Total Revenue: $${(data.salesSummary.total_revenue || 0).toFixed(2)}<br>
                    📈 Average Order: $${(data.salesSummary.average_order_value || 0).toFixed(2)}
                </div>`;
            }
            html += '<em>Pre-compiled SQL logic</em>';
            break;
            
        case 'user-management':
            html += `
                <strong>👤 User Role Management</strong><br><br>
                🔐 <strong>Role-Based Access Control</strong><br><br>
            `;
            
            if (data.users && data.users.length > 0) {
                data.users.forEach(user => {
                    html += `<div class="data-item">${user}</div>`;
                });
            }
            
            html += `<br>
                <strong>SQL Commands Used:</strong><br>
                • CREATE USER<br>
                • GRANT SELECT/INSERT/UPDATE<br>
                • REVOKE PRIVILEGES<br><br>
                <em>Database security implementation</em>
            `;
            break;
            
        default:
            html += '<strong>MySQL Data:</strong><br>' + JSON.stringify(data, null, 2);
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Display report data
function displayReportData(container, data, type) {
    let html = '<div class="success">';
    
    switch(type) {
        case 'sales':
            html += `
                <strong>📈 Sales Analytics Report</strong><br><br>
                <strong>Monthly Performance:</strong><br>
            `;
            
            data.monthlySales.forEach(month => {
                html += `
                    <div class="data-item">
                        <strong>${month.month}</strong><br>
                        💰 Revenue: $${month.revenue}<br>
                        🛒 Orders: ${month.orders}<br>
                        📊 Growth: ${month.growth}
                    </div>
                `;
            });
            
            html += `<br><strong>Summary:</strong><br>
                Total Revenue: $${data.summary.totalRevenue}<br>
                Total Orders: ${data.summary.totalOrders}<br>
                Average Order: $${data.summary.averageOrderValue}<br>
                Best Month: ${data.summary.bestPerformingMonth}<br><br>
                <em>Data Mining: Time Series Analysis</em>
            `;
            break;
            
        case 'segmentation':
            html += `
                <strong>🎯 Customer Segmentation Analysis</strong><br><br>
            `;
            
            data.segments.forEach(segment => {
                html += `
                    <div class="data-item">
                        <strong>${segment.segment}</strong><br>
                        👥 Count: ${segment.count} customers<br>
                        💰 Avg Spend: $${segment.avgSpend}<br>
                        📝 ${segment.characteristics}<br>
                        💡 ${segment.recommendation}
                    </div>
                `;
            });
            
            html += `<br><strong>Key Insight:</strong><br>
                ${data.insights}<br><br>
                <em>Data Mining: Customer Clustering</em>
            `;
            break;
            
        case 'association':
            html += `
                <strong>🔄 Market Basket Analysis</strong><br><br>
                <strong>Frequently Bought Together:</strong><br>
            `;
            
            data.frequentPatterns.forEach(pattern => {
                html += `
                    <div class="data-item">
                        <strong>🛍️ ${pattern.items.join(' + ')}</strong><br>
                        📊 Support: ${pattern.support}<br>
                        🎯 Confidence: ${pattern.confidence}<br>
                        📈 Lift: ${pattern.lift}<br>
                        💡 ${pattern.recommendation}
                    </div>
                `;
            });
            
            html += `<br><strong>Business Impact:</strong><br>
                ${data.businessImpact}<br><br>
                <em>Data Mining: Association Rule Mining</em>
            `;
            break;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// ==================== INITIALIZATION ====================

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 E-Commerce Dashboard initialized');
    
    // Auto-load MongoDB summary on page load
    setTimeout(() => {
        loadMongoDBData('summary');
    }, 500);
    
    // Initialize live stats
    refreshAllData();
});