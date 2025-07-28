import { createContext, useContext, useState, ReactNode } from "react";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയ��ളം", flag: "🇮���" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" }
];

// Comprehensive translations for all interface elements
export const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    menu: "Menu",
    suppliers: "Suppliers",
    inventory: "Inventory",
    analytics: "Analytics",
    notifications: "Notifications",
    goBack: "Go Back",
    goHome: "Go Home",
    preferences: "Preferences",
    
    // Authentication
    welcome: "Welcome back",
    signIn: "Sign In",
    signOut: "Sign Out",
    signedOut: "Signed Out",
    signedOutSuccess: "You have been signed out successfully",
    email: "Email",
    password: "Password",
    
    // Main Dashboard
    welcomeBack: "Welcome back",
    welcomeMessage: "3 new raw material deals available today. Check quality ratings and compare prices.",
    todaysRevenue: "Today's Revenue",
    fromYesterday: "from yesterday",
    newNotifications: "New Notifications",
    viewAll: "View All",
    unread: "unread",
    markAllRead: "Mark All Read",
    markAll: "Mark All",
    notificationDescription: "Stay updated with your business activities",
    
    // Quick Actions
    myOrders: "My Orders",
    myProfile: "My Profile",
    manageAccount: "Manage account",
    viewTrackOrders: "View & track orders",
    businessInsights: "Business insights",
    
    // Search
    searchRawMaterials: "Search Raw Materials",
    searchPlaceholder: "Search for rice, potatoes, oil, spices...",
    allCategories: "All Categories",
    grainsAndCereals: "Grains & Cereals",
    vegetables: "Vegetables",
    spices: "Spices",
    oils: "Oils",
    dairy: "Dairy",
    popularSearches: "Popular searches:",
    rice: "Rice",
    potatoes: "Potatoes",
    onions: "Onions",
    oil: "Oil",
    flour: "Flour",
    searchResults: "Search Results",
    clear: "Clear",
    noMaterialsFound: "No raw materials found for",
    tryDifferentKeywords: "Try different keywords or check spelling",
    
    // Supplier & Material Details
    bestPrice: "Best Price",
    bestQuality: "Best Quality",
    nearest: "Nearest",
    nearby: "Nearby",
    veryNear: "Very Near",
    compareSuppliers: "Compare Suppliers",
    quickOrder: "Quick Order",
    viewOrders: "View Orders",
    addToCart: "Add to Cart",
    cart: "Cart",
    contact: "Contact",
    addToOrder: "Add to Order",
    inStock: "In Stock",
    limited: "Limited",
    outOfStock: "Out of Stock",
    quality: "Quality",
    availability: "Availability",
    distance: "Distance",
    
    // Metrics
    availableSuppliers: "Available Suppliers",
    thisMonthOrders: "This Month Orders",
    avgQualityRating: "Avg Quality Rating",
    moneySaved: "Money Saved",
    
    // Quick Actions Section
    quickActions: "Quick Actions",
    manageMenu: "Manage Menu",
    checkInventory: "Check Inventory",
    
    // Recent Alerts
    recentAlerts: "Recent Alerts",
    bestDeal: "Best Deal",
    priceAlert: "Price Alert",
    seasonal: "Seasonal",
    newSupplier: "New supplier",
    pricesIncreased: "prices increased",
    harvestSeason: "harvest season deals",
    
    // Recent Activity
    recentActivity: "Recent Activity",
    orderedWheatFlour: "Ordered 50kg wheat flour",
    comparedSuppliers: "Compared 5 potato suppliers",
    savedMoney: "Saved ₹200 on spices order",
    
    // Profile Section
    vendorProfile: "Vendor Profile",
    businessInformation: "Business Information",
    businessType: "Business Type",
    address: "Address",
    phone: "Phone",
    operatingHours: "Operating Hours",
    specialties: "Specialties",
    accountDetails: "Account Details",
    memberSince: "Member Since:",
    license: "License:",
    totalOrders: "Total Orders",
    avgRating: "Avg Rating",
    monthlyRevenue: "Monthly Revenue",
    plan: "Plan",
    editProfile: "Edit Profile",
    verified: "Verified",
    
    // Settings
    settings: "Settings",
    accountSettings: "Account Settings",
    profileInformation: "Profile Information",
    privacySecurity: "Privacy & Security",
    businessSettings: "Business Settings",
    businessDetails: "Business Details",
    paymentMethods: "Payment Methods",
    taxLegal: "Tax & Legal",
    appPreferences: "App Preferences",
    language: "Language",
    theme: "Theme",
    helpSupport: "Help & Support",
    helpCenter: "Help Center",
    userGuide: "User Guide",
    contactSupport: "Contact Support",
    
    // Orders
    orderManagement: "Order Management",
    manageOrdersDeliveries: "Manage your orders and track deliveries",
    newOrder: "New Order",
    createNewOrder: "Create New Order",
    reviewCartPlace: "Review your cart and place order",
    cartItems: "Cart Items",
    cartEmpty: "Your cart is empty",
    addItemsFromSearch: "Add items from the raw materials search",
    orderSummary: "Order Summary",
    subtotal: "Subtotal:",
    deliveryCharges: "Delivery Charges:",
    total: "Total:",
    deliveryAddress: "Delivery Address",
    deliveryAddressPlaceholder: "Enter complete delivery address...",
    paymentMethod: "Payment Method",
    orderNotes: "Order Notes (Optional)",
    specialInstructions: "Any special instructions...",
    placeOrder: "Place Order",
    creatingOrder: "Creating Order...",
    orderCreatedSuccess: "Orders created successfully",
    noOrdersYet: "No Orders Yet",
    startFirstOrder: "Start by creating your first order",
    createOrder: "Create Order",
    trackOrder: "Track Order",
    viewDetails: "View Details",
    orderDate: "Order Date",
    delivery: "Delivery",
    
    // Payment Methods
    cashOnDelivery: "Cash on Delivery",
    payOnDeliveryArrival: "Pay when your order arrives at your doorstep",
    upiPayment: "UPI Payment",
    upiDescription: "Pay instantly using Google Pay, PhonePe, Paytm, etc.",
    creditDebitCard: "Credit/Debit Card",
    cardDescription: "Secure payment with your Visa, Mastercard, or RuPay card",
    netBanking: "Net Banking",
    netBankingDescription: "Pay directly from your bank account",
    onDelivery: "On delivery",
    instant: "Instant",
    secure: "Secure",
    
    // Order Status
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    paid: "Paid",
    paymentPending: "Payment Pending",
    
    // Actions
    view: "View",
    manage: "Manage",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    remove: "Remove",
    add: "Add",
    update: "Update",
    loading: "Loading...",
    retry: "Retry",
    back: "Back",
    continue: "Continue",
    next: "Next",
    previous: "Previous",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    
    // Common
    name: "Name",
    description: "Description",
    price: "Price",
    quantity: "Quantity",
    unit: "Unit",
    category: "Category",
    date: "Date",
    time: "Time",
    location: "Location",
    status: "Status",
    type: "Type",
    
    // Trusts & Features
    trustedBy: "Trusted by 5,000+ street vendors across India",
    comparePrices: "Compare Prices",
    verifiedSuppliers: "Verified Suppliers",
    localSupport: "Local Support",
    
    // Group Orders
    recommendedGroupOrders: "Recommended Group Orders",
    joinGroupOrdersDesc: "Join other vendors to get bulk discounts",
    joinGroupOrder: "Join Group Order",
    viewAllGroupOrders: "View All Group Orders",
    createGroupOrder: "Create Group Order",
    groupOrdersNearby: "Group Orders Nearby",
    bulkDiscount: "Bulk Discount",
    verifiedSupplier: "Verified Supplier",

    // Form Labels
    fullName: "Full Name",
    businessName: "Business Name",
    saveChanges: "Save Changes",
    profileUpdated: "Profile Updated",
    profileUpdatedSuccess: "Your profile has been updated successfully"
  },
  
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    menu: "मेन्यू",
    suppliers: "आपूर्तिकर्ता",
    inventory: "इन्वेंटरी",
    analytics: "विश्लेषण",
    notifications: "सूचनाएं",
    goBack: "वापस जाएं",
    goHome: "होम जाएं",
    preferences: "प्राथमिकताएं",
    
    // Authentication
    welcome: "वापस स्वागत है",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    signedOut: "साइन आउट हो गए",
    signedOutSuccess: "आप सफलतापूर्वक साइन आउट हो गए हैं",
    email: "ईमेल",
    password: "पासवर्ड",
    
    // Main Dashboard
    welcomeBack: "वापस स्वागत है",
    welcomeMessage: "आज 3 नए कच्चे माल के सौदे उपलब्ध ह��ं। गुणवत्ता रेटिंग जांचें और कीमतों की तुलना करें।",
    todaysRevenue: "आज की आय",
    fromYesterday: "कल से",
    newNotifications: "नई सूचनाएं",
    viewAll: "सभी देखें",
    unread: "अपठित",
    markAllRead: "सभी को पढ़ा गया चिह्नित करें",
    markAll: "सभी चिह्नित करें",
    notificationDescription: "अपनी व्यावसायिक गतिविधियों से अपडेट रहें",
    
    // Quick Actions
    myOrders: "मेरे ऑर्डर",
    myProfile: "मेरी प��रोफाइल",
    manageAccount: "खाता प्रबंधित करें",
    viewTrackOrders: "ऑर्डर देखें और ट्रैक करें",
    businessInsights: "���्यावसायिक अंतर्दृष्टि",
    
    // Search
    searchRawMaterials: "कच्चे माल खोजें",
    searchPlaceholder: "चावल, आलू, तेल, मसाले खोजें...",
    allCategories: "सभी श्रेणियां",
    grainsAndCereals: "अनाज और दालें",
    vegetables: "सब्जियां",
    spices: "मसाले",
    oils: "तेल",
    dairy: "डेयरी",
    popularSearches: "लोकप्रिय खोजें:",
    rice: "चावल",
    potatoes: "आलू",
    onions: "प्याज",
    oil: "तेल",
    flour: "आटा",
    searchResults: "खोज परिणाम",
    clear: "साफ़ करें",
    noMaterialsFound: "इसके लिए कोई कच्चा माल नहीं मिला",
    tryDifferentKeywords: "अलग कीवर्ड आज़माएं या वर्तनी जांचें",
    
    // Supplier & Material Details
    bestPrice: "सब���े अच्छी कीमत",
    bestQuality: "सबसे अच्छी गुणवत्ता",
    nearest: "निकटतम",
    compareSuppliers: "आपूर्���िकर्ताओं की तुलना करें",
    quickOrder: "त्वरित ऑर्डर",
    viewOrders: "ऑर्डर देखें",
    addToCart: "कार्ट में जोड़ें",
    cart: "कार्ट",
    contact: "संपर्क करें",
    addToOrder: "ऑर्डर में जोड़ें",
    inStock: "स्टॉक में",
    limited: "सीमित",
    outOfStock: "स्टॉक खत्म",
    quality: "गुणवत्ता",
    availability: "उपलब्धता",
    distance: "दूरी",
    
    // Metrics
    availableSuppliers: "उपलब्ध आपूर्तिकर्ता",
    thisMonthOrders: "इस महीने के ऑर्डर",
    avgQualityRating: "औसत गुणवत्ता रेटिंग",
    moneySaved: "बचाया गया पैसा",
    
    // Quick Actions Section
    quickActions: "त्वरित क्रियाएं",
    manageMenu: "मेन्यू प्रबंधित क��ें",
    checkInventory: "इ���्वेंटरी जांचें",
    
    // Recent Alerts
    recentAlerts: "हाल की अलर्ट",
    bestDeal: "सबसे अच्छा सौद��",
    priceAlert: "कीमत अलर्ट",
    seasonal: "मौसमी",
    newSupplier: "नया आपूर्तिकर्ता",
    pricesIncreased: "कीमतें बढ़ गईं",
    harvestSeason: "फसल सीज़न के सौदे",
    
    // Recent Activity
    recentActivity: "हालिया गतिविध���",
    orderedWheatFlour: "50 किलो गेहूं का आटा ऑर्डर कि��ा",
    comparedSuppliers: "5 आलू आपूर्तिकर्ताओं की तुलना की",
    savedMoney: "मसाले के ऑर्डर पर ₹200 बचाए",
    
    // Profile Section
    vendorProfile: "विक्रेता प्रोफाइल",
    businessInformation: "व्यावसायिक जानकारी",
    businessType: "व्यावसायिक प्रकार",
    address: "पता",
    phone: "फोन",
    operatingHours: "संचालन घंटे",
    specialties: "विशेषताएं",
    accountDetails: "��ाता विवरण",
    memberSince: "सदस्य बनने की तारीख:",
    license: "लाइसेंस:",
    totalOrders: "कुल ऑर���डर",
    avgRating: "औसत रेटिंग",
    monthlyRevenue: "मासिक आय",
    plan: "योजना",
    editProfile: "प्रोफाइल संपादित करें",
    verified: "सत्यापित",
    
    // Settings
    settings: "सेटिंग्स",
    accountSettings: "खाता सेटिंग्स",
    profileInformation: "प्रोफाइल जानकारी",
    privacySecurity: "गोपनीयता और सुरक्षा",
    businessSettings: "व्यावसायिक सेटिंग्स",
    businessDetails: "व्यावसायिक विवरण",
    paymentMethods: "भुगतान विधियां",
    taxLegal: "कर और कानूनी",
    appPreferences: "ऐप प्राथमिकताएं",
    language: "भाषा",
    theme: "थीम",
    helpSupport: "सहायता और समर्थन",
    helpCenter: "सहायता केंद्र",
    userGuide: "उपयोगकर्ता गाइड",
    contactSupport: "समर्थन से संपर्क करें",
    
    // Orders
    orderManagement: "ऑर्डर प्रबंधन",
    manageOrdersDeliveries: "अपने ऑर्डर प्रबंधित करें और डिलीवरी ट्रैक करें",
    newOrder: "नया ऑर्डर",
    createNewOrder: "नया ऑर्डर बनाएं",
    reviewCartPlace: "अपनी कार्ट की समीक्षा करें और ऑर्डर दें",
    cartItems: "कार्ट आइटम",
    cartEmpty: "आपकी कार��ट खाली है",
    addItemsFromSearch: "कच्चे माल की खोज से आइटम जोड़ें",
    orderSummary: "ऑर्डर सारांश",
    subtotal: "उपयोग:",
    deliveryCharges: "डिलीवरी शुल्क:",
    total: "कुल:",
    deliveryAddress: "डिलीवरी पता",
    deliveryAddressPlaceholder: "पूरा डिलीवरी पता दर्ज करें...",
    paymentMethod: "भुगतान विधि",
    orderNotes: "ऑर्डर नोट्स (वैकल्पिक)",
    specialInstructions: "कोई विशेष निर्देश...",
    placeOrder: "ऑर्डर दें",
    creatingOrder: "ऑर्डर बनाया ��ा रहा है...",
    orderCreatedSuccess: "ऑर्डर सफलतापूर्वक बनाए गए",
    noOrdersYet: "अभी तक कोई ऑर्डर नहीं",
    startFirstOrder: "अपना पहला ऑर्डर बनाकर शुरुआत करें",
    createOrder: "ऑर्डर बनाएं",
    trackOrder: "ऑर्डर ट्रैक करें",
    viewDetails: "विवरण देखें",
    orderDate: "ऑर्डर की तारीख",
    delivery: "डिलीवरी",
    
    // Payment Methods
    cashOnDelivery: "डिलीवरी पर भुगतान",
    payOnDeliveryArrival: "ऑर्डर पहुंचने पर भुगतान करें",
    upiPayment: "UPI भुगतान",
    upiDescription: "Google Pay, PhonePe, Paytm आदि का उपयोग करके तुरंत भुगतान करें",
    creditDebitCard: "क्रेडिट/डेबिट कार्ड",
    cardDescription: "अपने Visa, Mastercard, या RuPay कार्ड से सुरक्षित भुगतान",
    netBanking: "नेट बैंकिंग",
    netBankingDescription: "सीधे अपने बै��क खाते से भुगतान करें",
    onDelivery: "डिलीवरी पर",
    instant: "तुरंत",
    secure: "सुरक्षित",
    
    // Order Status
    pending: "लंबित",
    confirmed: "पुष्ट",
    preparing: "तैयार हो रहा",
    shipped: "भेज दिया",
    delivered: "डिलीवर",
    cancelled: "रद्द",
    paid: "भुगतान किया गया",
    paymentPending: "भुगतान लंबित",
    
    // Actions
    view: "देखें",
    manage: "प्रबंधित करें",
    edit: "संपादित करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    remove: "हटाएं",
    add: "जोड़ें",
    update: "अपडेट करें",
    loading: "लोड हो रहा है...",
    retry: "पुनः प्रयास करें",
    back: "वापस",
    continue: "जारी रखें",
    next: "अगला",
    previous: "पिछला",
    
    // Status
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    success: "सफलता",
    error: "त्रुटि",
    warning: "चेतावनी",
    info: "जानकारी",
    
    // Common
    name: "नाम",
    description: "विवरण",
    price: "की���त",
    quantity: "मात्रा",
    unit: "इकाई",
    category: "श्रेणी",
    date: "तारीख",
    time: "समय",
    location: "स्थान",
    status: "स्थिति",
    type: "प्��कार",
    
    // Trusts & Features
    trustedBy: "पूरे भारत में 5,000+ स्ट्रीट वेंडरों द्वारा भरोसेमंद",
    comparePrices: "कीमतों की तुलना करें",
    verifiedSuppliers: "सत्यापित आपूर्तिकर्ता",
    localSupport: "स्थानीय सहायता",
    
    // Form Labels
    fullName: "पूरा नाम",
    businessName: "व्यावसायिक नाम",
    saveChanges: "परिवर्तन सहेजें",
    profileUpdated: "प्रोफाइल अपडेट की गई",
    profileUpdatedSuccess: "आपकी प्रोफाइल सफलतापूर्वक अपडेट की गई है"
  },
  
  mr: {
    // Navigation
    dashboard: "डॅशबोर्ड",
    menu: "मेनू",
    suppliers: "पुरवठादार",
    inventory: "यादी",
    analytics: "विश्लेषण",
    notifications: "सूचना",
    
    // Authentication
    welcome: "परत स्वागत आहे",
    signIn: "साइन इन करा",
    signOut: "साइ��� आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    
    // Main Dashboard
    welcomeBack: "परत स्वागत आहे",
    welcomeMessage: "आज 3 नवीन कच्चा माल सौदे उपलब्ध आहेत. गुणवत्ता रेटिंग तपासा आणि किंमतींची तुलना करा.",
    todaysRevenue: "आजचे उत्पन्न",
    fromYesterday: "कालपासून",
    newNotifications: "नवीन सूचना",
    viewAll: "सर्व पहा",
    unread: "न वाचलेले",
    
    // Quick Actions
    myOrders: "माझे ऑर्डर",
    myProfile: "माझे प्रोफाइल",
    manageAccount: "खाते व्यवस्थापित करा",
    viewTrackOrders: "ऑर्डर पहा आणि ट्रॅक करा",
    businessInsights: "व्यावसायिक अंतर्दृष्टी",
    
    // Search
    searchRawMaterials: "कच्चा माल शोध���",
    searchPlaceholder: "तांदूळ, बटाटे, तेल, मसाले शोधा...",
    allCategories: "सर्व श्रेणी",
    grainsAndCereals: "धान्य आ��ि तृणधान्य",
    vegetables: "भाज्या",
    spices: "मसाले",
    oils: "तेले",
    dairy: "दुग्धजन्य पदार्थ",
    popularSearches: "लोकप्रिय शोध:",
    rice: "तांदूळ",
    potatoes: "बटाटे",
    onions: "कांदे",
    oil: "तेल",
    flour: "पीठ",
    searchResults: "शोध परिणाम",
    clear: "साफ करा",
    noMaterialsFound: "यासाठी कच्चा माल सापडला नाही",
    tryDifferentKeywords: "वेगळे कीवर्ड वापरून पहा किंवा स्पेलिंग तपासा",
    
    // Supplier & Material Details
    bestPrice: "सर्वोत्तम किंमत",
    bestQuality: "सर्वोत्तम गुणवत्ता",
    nearest: "जवळचे",
    compareSuppliers: "पुरवठादारांची ���ुलना करा",
    quickOrder: "त्वरित ऑर��डर",
    viewOrders: "ऑर्डर पहा",
    addToCart: "कार्टमध्ये जोडा",
    contact: "संपर्क साधा",
    addToOrder: "ऑर्डरमध्ये जोडा",
    inStock: "स्टॉकमध्ये",
    limited: "मर्यादित",
    outOfStock: "स्टॉक संपला",
    quality: "गुणवत्ता",
    availability: "उपलब्धता",
    distance: "अंतर",
    
    // Metrics
    availableSuppliers: "उपलब्ध पुरवठादार",
    thisMonthOrders: "या महिन्याचे ऑर्डर",
    avgQualityRating: "सरासरी गुणवत्ता रेटिंग",
    moneySaved: "बचत केलेले पैसे",
    
    // Quick Actions Section
    quickActions: "त्वरित क्रिया",
    manageMenu: "मेनू व्यवस्थापित करा",
    checkInventory: "यादी तपासा",
    
    // Recent Alerts
    recentAlerts: "अलीकडील अलर्ट",
    bestDeal: "सर्वोत्तम सौदा",
    priceAlert: "किंमत अ���र्ट",
    seasonal: "हंगामी",
    newSupplier: "नवीन पुरवठादार",
    pricesIncreased: "किंमती वाढल्या",
    harvestSeason: "हार्वेस्ट सीझन स���दे",
    
    // Recent Activity
    recentActivity: "अलीकडील क्रियाकलाप",
    orderedWheatFlour: "50 किलो गव्हाचे पीठ ऑर्डर केले",
    comparedSuppliers: "5 बटाटा पुरवठादारांची तुलना केली",
    savedMoney: "मसाल्याच्या ऑर्डरवर ₹200 बचत केली",
    
    // Profile Section
    vendorProfile: "विक्रेता प्रोफाइल",
    businessInformation: "व्यावसायिक माहिती",
    businessType: "व्यावसायिक प्रकार",
    address: "पत्ता",
    phone: "फोन",
    operatingHours: "कामकाजाचे तास",
    specialties: "विशेषता",
    accountDetails: "खाते तपशील",
    memberSince: "सदस्यत्व तारीख:",
    license: "परवाना:",
    totalOrders: "एकूण ऑर्ड���",
    avgRating: "सरासरी रेटिंग",
    monthlyRevenue: "मासिक उत्पन्न",
    plan: "योजना",
    editProfile: "प्रोफाइल संपादित करा",
    verified: "���त्���ापित",
    
    // Settings
    settings: "सेटिंग्स",
    accountSettings: "खाते सेटिंग्स",
    profileInformation: "प्रोफाइल माहिती",
    privacySecurity: "गोपनीयता आणि सुरक्षा",
    businessSettings: "व्यावसायिक सेटिंग्स",
    businessDetails: "व्यावसायिक तपशील",
    paymentMethods: "पेमेंट पद्धती",
    taxLegal: "कर आणि कायदेशीर",
    appPreferences: "अॅप प्राधान्ये",
    language: "भाषा",
    theme: "थीम",
    helpSupport: "मदत आणि समर्थन",
    helpCenter: "मदत केंद्र",
    userGuide: "वापरकर्ता मार्गदर्शक",
    contactSupport: "समर्थनाशी संपर्क साधा",
    
    // Orders
    orderManagement: "ऑर्डर व्यवस्थापन",
    manageOrdersDeliveries: "तुमचे ऑर्डर व���यवस्थापित करा आणि डिलिव्हरी ट्रॅक करा",
    newOrder: "नवीन ऑर्डर",
    createNewOrder: "नवीन ऑर्डर तयार करा",
    reviewCartPlace: "तुमची कार्ट पुनरावलोकन करा आणि ऑर्डर द्या",
    cartItems: "कार्ट आयटम",
    cartEmpty: "तुमची कार्ट रिकामी आहे",
    addItemsFromSearch: "कच्च्या मालाच्या शोधातून आयटम जोडा",
    orderSummary: "ऑर्डर सारांश",
    subtotal: "उपयोग:",
    deliveryCharges: "डिलिव्हरी शुल्क:",
    total: "एकूण:",
    deliveryAddress: "डिलिव्हरी पत्ता",
    deliveryAddressPlaceholder: "संपूर्ण डिलिव्हरी पत्ता टाका...",
    paymentMethod: "पेमेंट पद्धत",
    orderNotes: "ऑर्डर नोट्स (पर्यायी)",
    specialInstructions: "कोणत्याही विशेष सूचना...",
    placeOrder: "ऑर्डर द्या",
    creatingOrder: "ऑर्डर त��ार करत आहे...",
    orderCreatedSuccess: "ऑर्डर यशस्वीपणे तयार केले",
    noOrdersYet: "अजून को��तेही ऑर्डर नाहीत",
    startFirstOrder: "तुमचा पहिला ऑर्डर तयार करून सुरुवात करा",
    createOrder: "ऑर���डर तयार करा",
    trackOrder: "ऑ���्डर ट्रॅक करा",
    viewDetails: "तपशील पहा",
    orderDate: "ऑर्डरची तारीख",
    delivery: "डिलिव्हरी",
    
    // Payment Methods
    cashOnDelivery: "डिलिव्हरीवर रोकड",
    payOnDeliveryArrival: "ऑर्डर पोहोचल्यावर पैसे द्या",
    upiPayment: "UPI पेमेंट",
    upiDescription: "Google Pay, PhonePe, Paytm इत्यादी वापरून तत्काळ पेमेंट करा",
    creditDebitCard: "क्रेडिट/डेबिट कार्ड",
    cardDescription: "तुमच्या Visa, Mastercard, किंवा RuPay कार्डने सुरक्षित पेमेंट",
    netBanking: "नेट बँकिंग",
    netBankingDescription: "तुमच्या बँक खात्यातून थेट पेमेंट करा",
    onDelivery: "डिलिव्हरीवर",
    instant: "तत्काळ",
    secure: "सुरक्षित",
    
    // Order Status
    pending: "प्रलंबित",
    confirmed: "पुष्टी केली",
    preparing: "तयार करत आहे",
    shipped: "पाठवले",
    delivered: "डिलिव्हर केले",
    cancelled: "रद्द केले",
    paid: "पैसे दिले",
    paymentPending: "पेमेंट प्रलंबित",
    
    // Actions
    view: "पहा",
    manage: "व्यवस्थापित करा",
    edit: "संपादित करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    delete: "हटवा",
    remove: "काढा",
    add: "जोडा",
    update: "अपडेट करा",
    loading: "लोड होत आहे...",
    retry: "पुन्हा प्रयत्न करा",
    back: "मागे",
    continue: "सुरू ठेवा",
    next: "पुढे",
    previous: "मागील",
    
    // Status
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    success: "यश",
    error: "त्रुटी",
    warning: "चेता��णी",
    info: "माहिती",
    
    // Common
    name: "नाव",
    description: "वर्णन",
    price: "किंमत",
    quantity: "प्रमाण",
    unit: "एकक",
    category: "श्रेणी",
    date: "तारीख",
    time: "वेळ",
    location: "स्थान",
    status: "स्थिती",
    type: "प्रकार",
    
    // Trusts & Features
    trustedBy: "संपूर्ण भारतातील 5,000+ स्ट्रीट वेंडर्सकडून विश्वसनीय",
    comparePrices: "किंमतींची तुलना करा",
    verifiedSuppliers: "सत्यापित पुरवठादार",
    localSupport: "स्थानिक समर्थन",
    
    // Form Labels
    fullName: "पूर्ण नाव",
    businessName: "व्यावसायिक नाव",
    saveChanges: "बदल जतन करा"
  },
  
  gu: {
    // Navigation
    dashboard: "ડેશબોર્ડ",
    menu: "મેનુ",
    suppliers: "સપ્લાયર્સ",
    inventory: "ઇન્વેન્ટરી",
    analytics: "વિશ્લેષણ",
    notifications: "સૂચનાઓ",
    
    // Authentication
    welcome: "પાછા સ્વાગત છે",
    signIn: "સાઇન ઇન કરો",
    signOut: "સાઇન આઉટ",
    email: "ઇમેઇલ",
    password: "પાસવર્ડ",
    
    // Main Dashboard
    welcomeBack: "પાછા સ્વાગત છે",
    welcomeMessage: "આજે 3 નવા કાચા માલના સોદા ઉપલબ્ધ છે. ગુણવત્તા રેટિંગ તપાસો અને કિંમતોની તુલના કરો.",
    todaysRevenue: "આજની આવક",
    fromYesterday: "ગઈકાલથી",
    newNotifications: "નવી સૂચનાઓ",
    viewAll: "બધું જુઓ",
    unread: "ન વાંચેલું",
    
    // Quick Actions
    myOrders: "મારા ઓર્ડર",
    myProfile: "મારી પ્રોફાઇલ",
    manageAccount: "એકાઉન્ટ મેનેજ કરો",
    viewTrackOrders: "ઓર્ડર જુઓ અને ટ્રેક કરો",
    businessInsights: "બિઝનેસ ઇનસાઇટ્સ",
    
    // Search
    searchRawMaterials: "કાચો માલ શોધો",
    searchPlaceholder: "ચોખા, બટાકા, તેલ, મસાલા શોધો...",
    allCategories: "બધી કેટેગરી",
    grainsAndCereals: "અનાજ અને દાળ",
    vegetables: "શાકભાજી",
    spices: "મસાલા",
    oils: "તેલ",
    dairy: "ડેરી",
    popularSearches: "લોકપ્રિય શોધ:",
    rice: "ચોખા",
    potatoes: "બટાકા",
    onions: "ડુંગળી",
    oil: "તેલ",
    flour: "લોટ",
    searchResults: "શોધ પરિણામો",
    clear: "સાફ કરો",
    noMaterialsFound: "આના માટે કાચો માલ મળ્યો નથી",
    tryDifferentKeywords: "અલગ કીવર્ડ કે સ્પેલિંગ તપાસો",
    
    // Supplier & Material Details
    bestPrice: "શ્રેષ્ઠ કિંમત",
    bestQuality: "શ્રેષ્ઠ ગુણવત્તા",
    nearest: "નજીકનું",
    compareSuppliers: "સપ્લાયર્સની તુલના કરો",
    quickOrder: "ઝડપી ઓર્ડર",
    viewOrders: "ઓર્ડર જુઓ",
    addToCart: "કાર્ટમાં ઉમેરો",
    contact: "સંપર્ક કરો",
    addToOrder: "ઓર્���રમાં ઉમેરો",
    inStock: "સ્ટોકમાં",
    limited: "મ���્યાદિત",
    outOfStock: "સ્ટોક ખતમ",
    quality: "ગુણવત્તા",
    availability: "ઉપલબ્ધતા",
    distance: "અંતર",
    
    // Metrics
    availableSuppliers: "ઉપલબ્ધ સપ્લાયર્સ",
    thisMonthOrders: "આ મહિનાના ઓર્ડર",
    avgQualityRating: "સરેરાશ ગુણવત્તા રેટિંગ",
    moneySaved: "બચાવેલા પૈસા",
    
    // Quick Actions Section
    quickActions: "ઝડપી ક્રિયાઓ",
    manageMenu: "મેનૂ મેનેજ કરો",
    checkInventory: "ઇન્વેન્ટરી ચેક કરો",
    
    // Recent Alerts
    recentAlerts: "તાજેતરની અલર્ટ",
    bestDeal: "શ્રેષ્ઠ સોદો",
    priceAlert: "કિંમત અલર્ટ",
    seasonal: "મોસમી",
    newSupplier: "નવા સપ્લાયર",
    pricesIncreased: "કિંમતો વધી",
    harvestSeason: "હાર્વેસ્ટ સીઝન સોદા",
    
    // Recent Activity
    recentActivity: "તાજે��રની પ્રવૃત્તિ",
    orderedWheatFlour: "50 કિલો ઘઉંનો લ���ટ ઓર્ડર કર્યો",
    comparedSuppliers: "5 બટાકા સપ્લાયર્સની તુલના કરી",
    savedMoney: "મસાલાના ઓર્ડર પર ₹200 બચાવ્યા",
    
    // Profile Section
    vendorProfile: "વેન્ડર પ્રોફાઇલ",
    businessInformation: "બિઝનેસ માહિતી",
    businessType: "બિઝનેસ પ્રકાર",
    address: "સરનામું",
    phone: "ફોન",
    operatingHours: "કામના કલાકો",
    specialties: "વિશેષતાઓ",
    accountDetails: "એકાઉન્ટ વિગતો",
    memberSince: "સભ્યતા તારીખ:",
    license: "લાઇસન્સ:",
    totalOrders: "કુલ ઓર્ડર",
    avgRating: "સરેરાશ રેટિંગ",
    monthlyRevenue: "માસિક આવક",
    plan: "પ્લાન",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    verified: "વેરિફાઇડ",
    
    // Settings
    settings: "સેટિંગ્સ",
    accountSettings: "એકાઉ��્ટ સેટિંગ્સ",
    profileInformation: "પ્રોફાઇલ માહિતી",
    privacySecurity: "ગોપનીયતા અને સુરક્ષા",
    businessSettings: "બિઝનેસ સેટિંગ્સ",
    businessDetails: "બિઝનેસ વિગતો",
    paymentMethods: "પેમેન્ટ પદ્ધતિઓ",
    taxLegal: "ટેક્સ અને કાનૂની",
    appPreferences: "એપ પસંદગીઓ",
    language: "ભાષા",
    theme: "થીમ",
    helpSupport: "મદદ અને સહાય",
    helpCenter: "મદદ કેન્દ્ર",
    userGuide: "યુઝર ગાઇડ",
    contactSupport: "સહાય સાથે સંપર્ક કરો",
    
    // Orders
    orderManagement: "ઓર્ડર મેનેજમેન્ટ",
    manageOrdersDeliveries: "તમારા ઓર્ડર મેનેજ કરો અને ડિલિવરી ટ્રેક કરો",
    newOrder: "નવો ઓર્ડર",
    createNewOrder: "નવો ઓર્ડર બનાવો",
    reviewCartPlace: "તમારી કાર્ટ રિવ્યુ કરો અને ઓર્ડર આપો",
    cartItems: "કાર્ટ આઇટમ���સ",
    cartEmpty: "તમારી કાર્ટ ખાલી છે",
    addItemsFromSearch: "���ાચા માલની શોધમાંથી આઇટમ્સ ઉમેરો",
    orderSummary: "ઓર્ડર સારાંશ",
    subtotal: "સબટોટલ:",
    deliveryCharges: "ડિલિવરી ચાર્જીસ:",
    total: "કુલ:",
    deliveryAddress: "ડિલિવરી સરનામું",
    deliveryAddressPlaceholder: "સંપૂર્ણ ડિલિવરી સરનામું દાખલ કરો...",
    paymentMethod: "પેમેન્ટ પદ્ધતિ",
    orderNotes: "ઓર્ડર નોટ્સ (વૈકલ્પિક)",
    specialInstructions: "કોઈ ખાસ સૂચનાઓ...",
    placeOrder: "ઓર્ડર આપો",
    creatingOrder: "ઓર્ડર બનાવી રહ્યા છીએ...",
    orderCreatedSuccess: "ઓર્ડર સફળતાપૂર્વક બનાવ્યા",
    noOrdersYet: "હજુ સુધી કોઈ ઓર્ડર નથી",
    startFirstOrder: "તમારો પહેલો ઓર્ડર બનાવીને શરૂ કરો",
    createOrder: "ઓર્ડર બનાવો",
    trackOrder: "ઓર્ડર ટ્રેક કરો",
    viewDetails: "વિગતો જુઓ",
    orderDate: "ઓર્ડ���ની તારીખ",
    delivery: "ડિલિવરી",
    
    // Payment Methods
    cashOnDelivery: "ડિ��િવર�� પર કેશ",
    payOnDeliveryArrival: "ઓર્ડર પહોંચ્યા પછી પૈસા આપો",
    upiPayment: "UPI પેમેન્ટ",
    upiDescription: "Google Pay, PhonePe, Paytm વગેરે વાપરીને ��રત જ પેમેન્ટ કરો",
    creditDebitCard: "ક્રેડિટ/ડેબિટ કાર્ડ",
    cardDescription: "તમારા Visa, Mastercard અથવા RuPay કાર્ડ સાથે સુરક્ષિત પેમેન્ટ",
    netBanking: "નેટ બેંકિંગ",
    netBankingDescription: "તમારા બેંક એકાઉન્ટમાંથી સીધું પેમેન્ટ કરો",
    onDelivery: "ડિલિવરી પર",
    instant: "તરત જ",
    secure: "સુરક્ષિત",
    
    // Order Status
    pending: "બાકી",
    confirmed: "કન્ફર્મ થયું",
    preparing: "તૈયાર કરી રહ્યા છીએ",
    shipped: "મોકલ્યું",
    delivered: "ડિલિવર થયું",
    cancelled: "રદ થયું",
    paid: "પેમેન્ટ થયું",
    paymentPending: "પેમેન્ટ બાકી",
    
    // Actions
    view: "જુઓ",
    manage: "મેનેજ કરો",
    edit: "સંપાદિત કરો",
    save: "સેવ કરો",
    cancel: "રદ કરો",
    delete: "ડિલીટ કરો",
    remove: "દૂર કરો",
    add: "ઉમેરો",
    update: "અપડેટ કરો",
    loading: "લોડ થઈ રહ્યું છે...",
    retry: "ફરી પ્રયાસ કરો",
    back: "પાછળ",
    continue: "ચાલુ રાખો",
    next: "આગળ",
    previous: "પહેલાં",
    
    // Status
    active: "સક્રિય",
    inactive: "નિષ્ક્રિય",
    success: "સફળતા",
    error: "ભૂલ",
    warning: "ચેતવણી",
    info: "માહિતી",
    
    // Common
    name: "નામ",
    description: "વર્ણન",
    price: "કિંમત",
    quantity: "જથ્થો",
    unit: "એકમ",
    category: "કેટેગરી",
    date: "તારીખ",
    time: "સમય",
    location: "સ્થાન",
    status: "સ્થિતિ",
    type: "પ્રકાર",
    
    // Trusts & Features
    trustedBy: "સમગ્ર ભારતમાં 5,000+ સ��ટ્રીટ ���ેન્ડર્સ દ્વારા વિશ્વસનીય",
    comparePrices: "કિંમતોની તુલના કરો",
    verifiedSuppliers: "વેરિફાઇડ સપ્લાયર્સ",
    localSupport: "સ્થાનિક સહાય",
    
    // Form Labels
    fullName: "પૂરું નામ",
    businessName: "બિઝનેસ નામ",
    saveChanges: "ફેરફારો સેવ કરો"
  },
  
  ta: {
    // Navigation
    dashboard: "டாஷ்போர்டு",
    menu: "மெனு",
    suppliers: "சப்ளையர்கள்",
    inventory: "இன்வென்டரி",
    analytics: "பகுப்பாய்வு",
    notifications: "அறிவிப்புகள்",
    
    // Authentication
    welcome: "மீண்டும் வரவேற்கிறோம்",
    signIn: "உள்நுழைக",
    signOut: "வெளியேறு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    
    // Main Dashboard
    welcomeBack: "மீண்டும் வரவ���ற்கிறோம்",
    welcomeMessage: "இன்று 3 புதிய மூலப்பொர��ள் ஒப்பந���தங்கள் கிடைக்கின்றன. தரம் ம��ிப்பீடுகளை சரிபார்த்து விலைகளை ஒப்��ிடுங்கள்.",
    todaysRevenue: "இன்றைய வருமானம்",
    fromYesterday: "நேற்றிலிருந்து",
    newNotifications: "புதிய அறிவிப்புகள்",
    viewAll: "அனைத்தையும் பார்க்க",
    unread: "படிக்காதது",
    
    // Quick Actions
    myOrders: "என் ஆர்டர்கள்",
    myProfile: "என் விவரக்குறிப்பு",
    manageAccount: "கணக்கை நிர்வகிக்கவும்",
    viewTrackOrders: "ஆர்டர்களை பார்க்கவும் மற்றும் கண்காணிக்கவும்",
    businessInsights: "வணிக நுண்ணறிவுகள்",
    
    // Search
    searchRawMaterials: "மூலப்பொருட்களை தேடுங்கள்",
    searchPlaceholder: "அரிசி, உருளை��்கிழங்கு, எண்ணெய், மசால��� தேடுங்கள்...",
    allCategories: "அனைத்து வகைகள்",
    grainsAndCereals: "த��னியங்கள் மற்றும் பயறுகள்",
    vegetables: "கா���்கறிகள்",
    spices: "மசாலாப்பொருட்கள்",
    oils: "எண்ணெய்கள்",
    dairy: "பால் பொருட்கள்",
    popularSearches: "பிரபலமான தேடல்கள்:",
    rice: "அரிசி",
    potatoes: "உருளைக்கிழங்கு",
    onions: "வெங்காயம்",
    oil: "எண்ணெய்",
    flour: "மாவு",
    searchResults: "தேடல் முடிவுகள்",
    clear: "அழிக்கவும்",
    noMaterialsFound: "இதற்கான மூலப்பொருட்கள் கிடைக்கவில்லை",
    tryDifferentKeywords: "வேறு முக்கிய வார்த்தைகளை முயற்சிக்கவும் அல்லது எழுத்துப்பிழையை சரிபார்க்கவும்",
    
    // Supplier & Material Details
    bestPrice: "ச���றந்த விலை",
    bestQuality: "சிறந்த தரம்",
    nearest: "அருகில் உள்ளது",
    compareSuppliers: "சப்ளையர்களை ஒ���்பிடுங்கள்",
    quickOrder: "விரைவு ஆர்டர்",
    viewOrders: "���ர்டர்களை பார்க்கவும்",
    addToCart: "கார்ட்டில் சேர்க்கவும்",
    contact: "தொடர்பு",
    addToOrder: "ஆர்டரில் சேர்க்கவும்",
    inStock: "கையிருப்பில் உள்ளது",
    limited: "குறைவானது",
    outOfStock: "கையிருப்பு இல்லை",
    quality: "தரம்",
    availability: "கிடைக்கும் தன்மை",
    distance: "தூரம்",
    
    // Metrics
    availableSuppliers: "கிடைக்கும் சப்ளையர்கள்",
    thisMonthOrders: "இந்த மாத ஆர்டர்கள்",
    avgQualityRating: "சராசரி தர மதிப்பீடு",
    moneySaved: "சேமித்த பணம்",
    
    // Quick Actions Section
    quickActions: "விரைவு நடவடிக்கைகள்",
    manageMenu: "மெனுவை நிர்வகிக்கவும்",
    checkInventory: "இன்வென்டரியை சரிபார்க்���வும்",
    
    // Recent Alerts
    recentAlerts: "���மீபத்திய எச்சரிக்கைகள்",
    bestDeal: "சிறந்த ஒப்பந்தம்",
    priceAlert: "விலை எச்சரிக்கை",
    seasonal: "பருவகால",
    newSupplier: "புதிய சப்ளையர்",
    pricesIncreased: "விலைகள் அதிகரித்தன",
    harvestSeason: "அறுவடை பருவ ஒப்பந்தங்கள்",
    
    // Recent Activity
    recentActivity: "சமீபத்திய செயல்பாடு",
    orderedWheatFlour: "50 கிலோ கோதுமை மாவு ஆர்டர் செய்தேன்",
    comparedSuppliers: "5 உருளைக்கிழங்கு சப்ளையர்களை ஒப்பிட்டேன்",
    savedMoney: "மசாலா ஆர்டரில் ₹200 சேமித்தேன்",
    
    // Profile Section
    vendorProfile: "விற்பனையாளர் விவரக்குறிப்பு",
    businessInformation: "வணிக தகவல்",
    businessType: "வணிக வகை",
    address: "முகவரி",
    phone: "தொலைபேசி",
    operatingHours: "செயல்பாட்டு நே��ம்",
    specialties: "சிறப்��ுகள்",
    accountDetails: "கணக்கு விவரங்கள்",
    memberSince: "உறுப்பினர் தேதி:",
    license: "உரிமம்:",
    totalOrders: "மொத்த ஆர்டர்கள்",
    avgRating: "சராசரி மதிப்பீடு",
    monthlyRevenue: "மாதாந்திர வருமானம்",
    plan: "திட்டம்",
    editProfile: "விவரக்குறிப்பை திருத்தவும்",
    verified: "சரிபார்க்கப்பட்டது",
    
    // Settings
    settings: "அமைப்புகள்",
    accountSettings: "கணக்கு அமைப்புகள்",
    profileInformation: "விவரக்குறிப்பு தகவல்",
    privacySecurity: "தனியுரிமை மற்றும் பாதுகாப்பு",
    businessSettings: "வணிக அமைப்புகள்",
    businessDetails: "வணிக விவரங்கள்",
    paymentMethods: "பணம் செலுத்தும் முறைகள்",
    taxLegal: "வரி மற்றும் சட்டபூர்வ",
    appPreferences: "ஆப் விருப்பத்��ேர்வுகள்",
    language: "மொழி",
    theme: "தீம்",
    helpSupport: "உதவி மற்றும் ஆதரவு",
    helpCenter: "உதவி மையம்",
    userGuide: "பயனர் வழிகாட்டி",
    contactSupport: "ஆதரவை தொடர்பு கொள்ளவும்",
    
    // Orders
    orderManagement: "ஆர்டர் மேலாண்மை",
    manageOrdersDeliveries: "உங்கள் ஆர்டர்களை நிர்வகித்து டெலிவரியை கண்காணிக்கவும்",
    newOrder: "புதிய ஆர்டர்",
    createNewOrder: "புதிய ஆர்டர் உருவாக்கவும்",
    reviewCartPlace: "உங்கள் கார்ட்டை மதிப்பாய்வு செய்து ஆர்டர் செய்யவும்",
    cartItems: "கார்ட் பொருட்கள்",
    cartEmpty: "உங்கள் கார்ட் காலியாக உள்ளது",
    addItemsFromSearch: "மூலப்பொருள் தேடலில் இருந்து பொருட்களை சேர்க்கவும்",
    orderSummary: "ஆர்��ர் சுருக்கம்",
    subtotal: "துணை மொத்தம்:",
    deliveryCharges: "டெலிவரி கட்டணம்:",
    total: "மொத்தம்:",
    deliveryAddress: "டெலிவரி முகவரி",
    deliveryAddressPlaceholder: "முழுமையான டெலிவரி முகவரியை உள்ளிடவும்...",
    paymentMethod: "பணம் செலுத்தும் முறை",
    orderNotes: "ஆர்டர் குறிப்புகள் (விருப்பமானது)",
    specialInstructions: "ஏதேனும் சிறப்பு வழிமுறைகள்...",
    placeOrder: "ஆர்டர் செய்யவும்",
    creatingOrder: "ஆர்டர் உருவாக்கப்படுகிறது...",
    orderCreatedSuccess: "ஆர்டர்கள் வெற்றிகரமாக உருவாக்கப்பட்டன",
    noOrdersYet: "இதுவரை ஆர்டர்கள் இல்லை",
    startFirstOrder: "உங்கள் முதல் ஆர்டரை உருவாக்கி ���ொடங்குங்கள்",
    createOrder: "ஆர்டர் உருவாக்கவு��்",
    trackOrder: "ஆர்டரை கண்காணிக்கவும்",
    viewDetails: "விவரங்களை பார்க்கவும்",
    orderDate: "ஆர்டர் தேதி",
    delivery: "டெலிவரி",
    
    // Payment Methods
    cashOnDelivery: "டெலிவரியின் போது பணம்",
    payOnDeliveryArrival: "ஆர்டர் வரும்போது பணம் செலுத்துங்கள்",
    upiPayment: "UPI பணம் செலுத்துதல்",
    upiDescription: "Google Pay, PhonePe, Paytm போன்றவற்றைப் பயன்படுத்தி உடனடியாக பணம் செலுத்துங்கள்",
    creditDebitCard: "கிரெடிட்/டெபிட் கார்டு",
    cardDescription: "உங்கள் Visa, Mastercard அல்லது RuPay கார்டுடன் பாதுகாப்பான பணம் செலுத்துதல்",
    netBanking: "நெட் பேங்கிங்",
    netBankingDescription: "உங்கள் வங்கி கணக்கிலிர��ந்து நேரடியாக பண��் செலுத்துங்கள்",
    onDelivery: "டெலிவரியின் போது",
    instant: "உடனடி",
    secure: "பாதுகாப்பான",
    
    // Order Status
    pending: "நிலுவையில்",
    confirmed: "உறுதிப்படுத்தப்பட்டது",
    preparing: "தயாரிக்கப்படுகிறது",
    shipped: "அனுப்பப்பட்டது",
    delivered: "டெலிவர் செய்யப்பட்டது",
    cancelled: "ரத்து செய்யப்பட்டது",
    paid: "பணம் செலுத்தப்பட்டது",
    paymentPending: "பணம் செலுத்துதல் நிலுவையில்",
    
    // Actions
    view: "பார்க்கவும்",
    manage: "நிர்வகிக்கவும்",
    edit: "திருத்தவும்",
    save: "சேமிக்கவும்",
    cancel: "ரத்து ���ெய்யவும்",
    delete: "நீக்கவும்",
    remove: "அகற்றவும்",
    add: "சேர்க்கவும்",
    update: "ப��துப்பிக்கவும���",
    loading: "ஏற்றப்படுகிறது...",
    retry: "மீண்டும் முயற்சிக்கவும்",
    back: "பின்",
    continue: "தொடரவும்",
    next: "அடுத்தது",
    previous: "முந்தைய",
    
    // Status
    active: "செயலில்",
    inactive: "செயலற்ற",
    success: "வெற்றி",
    error: "பிழை",
    warning: "எச்சரிக்கை",
    info: "தகவல்",
    
    // Common
    name: "பெயர்",
    description: "விளக்கம்",
    price: "விலை",
    quantity: "அளவு",
    unit: "அலகு",
    category: "வகை",
    date: "தேதி",
    time: "நேரம்",
    location: "இடம்",
    status: "நிலை",
    type: "வகை",
    
    // Trusts & Features
    trustedBy: "இந்தியா முழுவதும் 5,000+ தெரு விற்பனையாளர்களால் ��ம்பப்படுகிறது",
    comparePrices: "விலைகளை ஒப்பிடுங்கள்",
    verifiedSuppliers: "சரிபார்க்கப்ப���்ட சப்ளைய��்கள்",
    localSupport: "உள்ளூர் ஆதரவு",
    
    // Form Labels
    fullName: "முழு பெயர்",
    businessName: "வணிக பெயர்",
    saveChanges: "மாற்றங்களை சேமிக்கவும்"
  },
  
  te: {
    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    menu: "మెనూ",
    suppliers: "సప్లైయర్లు",
    inventory: "ఇన్వెంటరీ",
    analytics: "విశ్లేషణలు",
    notifications: "నోటిఫికేషన్లు",
    
    // Basic translations for Telugu
    welcome: "తిరిగి స్వాగతం",
    signIn: "సైన్ ఇన్",
    signOut: "సైన్ అవుట్",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    welcomeBack: "తిరిగి స్వాగతం",
    myOrders: "నా ఆర్డర్లు",
    myProfile: "నా ప్రొఫ���ల్",
    searchRawMaterials: "మ���డిసరుకులను వెతకండి",
    settings: "సెట్టింగ్‌లు"
  },
  
  kn: {
    // Navigation
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    menu: "ಮೆನು",
    suppliers: "ಸಪ್ಲೈಯರ್‌ಗಳು",
    inventory: "ಇನ್ವೆಂಟರಿ",
    analytics: "ವಿಶ್ಲೇಷಣೆಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    
    // Basic translations for Kannada
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
    signIn: "ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ",
    myOrders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    myProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    searchRawMaterials: "ಕಚ್ಚಾ ವಸ್ತುಗಳನ್ನು ಹುಡುಕಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"
  },
  
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    menu: "মেনু",
    suppliers: "সরবরাহকারী",
    inventory: "ইনভেন্টরি",
    analytics: "বিশ্লেষণ",
    notifications: "বিজ্ঞপ্তি",
    
    // Basic translations for Bengali
    welcome: "আবার স্বাগতম",
    signIn: "সাইন ইন",
    signOut: "সাইন আউ���",
    email: "ইমেইল",
    password: "পাসওয়ার���ড",
    welcomeBack: "আবার স্বাগত���",
    myOrders: "আমার অর্ডার",
    myProfile: "আমার প্রোফাইল",
    searchRawMaterials: "কাঁচামাল খুঁজুন",
    settings: "সেটিংস"
  },
  
  ml: {
    // Navigation
    dashboard: "ഡാഷ്ബോർഡ്",
    menu: "മെനു",
    suppliers: "വിതരണക്കാർ",
    inventory: "ഇൻവെന്ററി",
    analytics: "വിശകലനം",
    notifications: "അറിയിപ്പുകൾ",
    
    // Basic translations for Malayalam
    welcome: "വീണ്ടും സ്വാഗതം",
    signIn: "സൈൻ ഇൻ",
    signOut: "സൈൻ ഔട്ട്",
    email: "ഇമെയിൽ",
    password: "പാസ്‌വേഡ്",
    welcomeBack: "വീണ്ടും സ്വാഗതം",
    myOrders: "എന്റെ ഓർഡറുകൾ",
    myProfile: "എന്റെ പ്രൊഫൈൽ",
    searchRawMaterials: "അസംസ്‌കൃത വസ്തുക്കൾ തിരയുക",
    settings: "ക്രമീകരണങ്ങൾ"
  },
  
  pa: {
    // Navigation
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    menu: "ਮੀਨੂ",
    suppliers: "ਸਪਲਾਇਰ",
    inventory: "ਇੰਵੈਟਰੀ",
    analytics: "ਵਿਸ਼ਲੇਸ਼ਣ",
    notifications: "ਸੂਚਨਾਵ���ਂ",
    
    // Basic translations for Punjabi
    welcome: "ਮੁੜ ਜੀ ਆਇਆਂ ਨੂੰ",
    signIn: "ਸਾਇਨ ਇਨ",
    signOut: "ਸਾਇਨ ਆਊਟ",
    email: "ਈਮੇਲ",
    password: "ਪਾਸਵਰਡ",
    welcomeBack: "ਮੁੜ ਜੀ ਆਇਆਂ ਨੂੰ",
    myOrders: "ਮੇਰੇ ਆਰਡਰ",
    myProfile: "ਮੇਰੀ ਪ੍ਰੋਫਾਇਲ",
    searchRawMaterials: "ਕੱਚਾ ਮਾਲ ਲੱਭੋ",
    settings: "ਸੈਟਿੰਗਜ��"
  }
};

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  suggestLanguageForLocation: (location: string) => Language | null;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Location-based language mapping
const locationLanguageMap: Record<string, string> = {
  "mumbai": "mr", // Marathi
  "maharashtra": "mr",
  "pune": "mr",
  "delhi": "hi", // Hindi
  "ncr": "hi",
  "gujarat": "gu", // Gujarati
  "ahmedabad": "gu",
  "surat": "gu",
  "tamil nadu": "ta", // Tamil
  "chennai": "ta",
  "andhra pradesh": "te", // Telugu
  "telangana": "te",
  "hyderabad": "te",
  "karnataka": "kn", // Kannada
  "bangalore": "kn",
  "bengaluru": "kn",
  "west bengal": "bn", // Bengali
  "kolkata": "bn",
  "kerala": "ml", // Malayalam
  "kochi": "ml",
  "punjab": "pa", // Punjabi
  "chandigarh": "pa"
};

// Function to detect language based on location
const detectLanguageFromLocation = (): Language => {
  // Try to get location from browser geolocation or user input
  // For now, we'll use a simple detection based on browser language
  const browserLang = navigator.language.split('-')[0];

  // Check if browser language is supported
  const supportedLang = languages.find(lang => lang.code === browserLang);
  if (supportedLang) {
    return supportedLang;
  }

  // Default to English if not found
  return languages[0];
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved) {
      return JSON.parse(saved);
    }
    // Try to detect language based on location/browser
    return detectLanguageFromLocation();
  });

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("language", JSON.stringify(language));
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  // Function to suggest language based on location
  const suggestLanguageForLocation = (location: string): Language | null => {
    const locationLower = location.toLowerCase();
    for (const [place, langCode] of Object.entries(locationLanguageMap)) {
      if (locationLower.includes(place)) {
        return languages.find(lang => lang.code === langCode) || null;
      }
    }
    return null;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, suggestLanguageForLocation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
