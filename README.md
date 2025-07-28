# StreetSource - Comprehensive Vendor Supply Platform

A full-stack web application for street vendors to manage raw materials, compare suppliers, track orders, and process payments securely. Built with modern technologies and inspired by platforms like Blinkit and Digihaat.

## 🚀 Features

### 🔐 User Management
- **Enhanced Vendor Profile**: Complete profile management with business details, documents, and bank information
- **Real-time Profile Updates**: Edit and save profile information with validation
- **Multi-language Support**: Support for 10+ Indian regional languages with location-based detection
- **Dark/Light Theme**: System-aware theme switching with custom color palette

### 📍 Location-Based Services
- **GPS Location Detection**: Automatic location detection for better supplier recommendations
- **Proximity-based Filtering**: Find suppliers within specified radius
- **Real-time Distance Calculation**: Show accurate distance and delivery time estimates
- **Area-specific Pricing**: Location-based pricing and availability

### 🛒 Advanced Search & Ordering
- **Intelligent Search**: Real-time search with category filtering and autocomplete
- **Supplier Comparison**: Compare prices, quality ratings, and delivery times
- **Smart Cart Management**: Add/remove items with quantity controls and stock validation
- **Bulk Ordering**: Support for minimum quantity requirements and bulk discounts

### 📦 Order Management System
- **Complete Order Lifecycle**: From cart to delivery with status tracking
- **Multiple Suppliers**: Handle orders from multiple suppliers simultaneously
- **Order History**: View past orders with detailed information
- **Quantity Tracking**: Real-time stock updates and availability monitoring

### 🚚 Delivery Tracking
- **Real-time Tracking**: Live delivery status updates with GPS coordinates
- **Delivery Partner Info**: Contact details and vehicle information
- **Estimated Arrival**: Accurate delivery time predictions
- **Status Notifications**: Push notifications for order updates

### 💳 Secure Payment Processing
- **Multiple Payment Methods**:
  - Cash on Delivery (COD)
  - UPI Payment (Google Pay, PhonePe, Paytm)
  - Credit/Debit Cards (Visa, Mastercard, RuPay)
  - Net Banking (All major banks)
- **Secure Transactions**: Encrypted payment processing with fraud detection
- **Transaction History**: Complete payment records and receipts
- **Processing Fees**: Transparent fee structure for different payment methods

### 📊 Analytics & Insights
- **Business Metrics**: Revenue tracking, order analytics, and performance insights
- **Supplier Performance**: Quality ratings and delivery metrics
- **Cost Optimization**: Money-saving recommendations and supplier comparisons
- **Trend Analysis**: Market price trends and seasonal insights

### 🔔 Real-time Notifications
- **Order Updates**: Real-time notifications for order status changes
- **Price Alerts**: Notifications for price changes and market trends
- **Delivery Updates**: Live delivery tracking notifications
- **System Alerts**: Important updates and promotional offers
- **Priority Levels**: High, medium, and low priority notification system

### 📱 Mobile-Responsive Design
- **Progressive Web App**: Mobile-first design with PWA capabilities
- **Touch-friendly Interface**: Optimized for mobile and tablet devices
- **Offline Support**: Basic functionality works without internet connection
- **Fast Loading**: Optimized performance for slow network conditions

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with excellent developer experience
- **Vite**: Fast build tool with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn/ui**: Beautiful and accessible component library
- **React Router 6**: Client-side routing with data loading
- **Tanstack Query**: Server state management and caching

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for API development
- **TypeScript**: Type-safe backend development
- **RESTful APIs**: Well-structured API endpoints with proper HTTP methods
- **Mock Database**: In-memory data storage for development (easily replaceable with real database)

### Additional Features
- **Real-time Updates**: WebSocket-like functionality for live data
- **Geolocation Services**: GPS and location-based features
- **Payment Integration**: Secure payment processing simulation
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 🏗 Project Structure

```
streetsource/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Shadcn/ui)
│   │   ├── OrderManagement.tsx
│   │   ├── DeliveryTracking.tsx
│   │   └── PaymentProcessor.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── use-theme.tsx
│   │   ├── use-language.tsx
│   │   └── use-toast.ts
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main dashboard
│   │   ├── Notifications.tsx
│   │   ├── Analytics.tsx
│   │   ├── MenuManagement.tsx
│   │   └── ...
│   └── lib/               # Utility libraries
├── server/                # Backend Express application
│   ├── models/            # Data models and database
│   │   └── database.ts    # Mock database with comprehensive data
│   ├── routes/            # API route handlers
│   │   ├── api.ts         # Main API endpoints
│   │   └── vendors.ts     # Legacy vendor routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and utilities
│   └── api.ts             # Shared TypeScript interfaces
└── netlify/               # Deployment configuration
    └── functions/         # Serverless functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/streetsource.git
   cd streetsource
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both the frontend (React) and backend (Express) servers concurrently.

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Building for Production

```bash
npm run build
```

This creates optimized builds for both frontend and backend in the `dist/` directory.

## 📡 API Endpoints

### Vendor Management
- `GET /api/vendor/profile/:vendorId` - Get vendor profile
- `PUT /api/vendor/profile/:vendorId` - Update vendor profile

### Location & Suppliers
- `GET /api/location` - Get user location
- `GET /api/suppliers/nearby` - Get nearby suppliers with location filtering

### Raw Materials
- `GET /api/materials` - Search and filter raw materials
- Query parameters: `search`, `category`, `latitude`, `longitude`

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders/:vendorId` - Get vendor orders
- `PUT /api/orders/:orderId/status` - Update order status

### Delivery Tracking
- `GET /api/tracking/:orderId` - Get real-time tracking information

### Payment Processing
- `POST /api/payments/process` - Process secure payments

### Analytics
- `GET /api/analytics/vendor/:vendorId` - Get vendor analytics

### Notifications
- `GET /api/notifications/:vendorId` - Get vendor notifications

## 🎯 Key Differentiators

### 1. **Street Vendor Focused**
- Specifically designed for street food vendors and small businesses
- Simple, intuitive interface suitable for non-technical users
- Local language support with cultural considerations

### 2. **Real-time Everything**
- Live price updates and stock availability
- Real-time delivery tracking with GPS coordinates
- Instant notifications for critical updates

### 3. **Smart Recommendations**
- AI-powered supplier recommendations based on order history
- Cost optimization suggestions
- Quality-based supplier ranking

### 4. **Financial Inclusion**
- Multiple payment options including cash on delivery
- Transparent pricing with no hidden fees
- Credit/payment term management for trusted suppliers

### 5. **Local Market Integration**
- Integration with local wholesale markets and mandis
- Seasonal pricing and availability information
- Regional specialty items and local suppliers

## 🔒 Security Features

- **Secure Payment Processing**: Encrypted payment data with industry-standard security
- **Data Protection**: User data encryption and secure storage
- **Authentication**: Secure vendor authentication and session management
- **API Security**: Rate limiting and input validation on all endpoints
- **HTTPS Enforcement**: Secure communication in production

## 🌟 Future Enhancements

- **AI-Powered Insights**: Machine learning for demand forecasting and price prediction
- **Inventory Management**: Advanced inventory tracking and automatic reordering
- **Supplier Network**: Expanded supplier network with verified vendors
- **Mobile App**: Native mobile applications for iOS and Android
- **Blockchain Integration**: Supply chain transparency and traceability
- **IoT Integration**: Smart inventory sensors and automated ordering

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, TypeScript, Tailwind CSS
- **Backend Development**: Node.js, Express, RESTful APIs
- **UI/UX Design**: Mobile-first responsive design
- **DevOps**: Vite build system, Netlify deployment

## 📞 Support

For support, email support@streetsource.com or join our community chat.

---

**StreetSource** - Empowering street vendors with technology for better business outcomes. 🚀
