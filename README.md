# Zen Register - Modern Point of Sale System

A beautifully crafted, full-featured point-of-sale (POS) system designed with Japanese aesthetic principles of *ma* (negative space) and *kanso* (simplicity). Built with pure vanilla JavaScript, HTML, and CSS - no frameworks required.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow.svg)

## 🌟 Overview

Zen Register is a complete cash register solution that combines elegant design with powerful functionality. Perfect for small retail stores, cafes, restaurants, or any business needing a reliable POS system without the complexity of enterprise software.

## ✨ Key Features

### Core POS Functionality
- **Product Management**: Scan or manually enter product codes
- **Shopping Cart**: Add, modify, void items with real-time calculations
- **Payment Processing**: Support for cash and card payments with change calculation
- **Receipt Generation**: Professional receipts with print capability
- **Tax Calculation**: Automatic tax computation (configurable rate)
- **Discount System**: Apply percentage discounts to transactions

### Inventory Management
- **Product Database**: Add, edit, and delete products
- **Stock Tracking**: Real-time inventory levels
- **CSV Import**: Bulk upload products via CSV files
- **Low Stock Alerts**: Visual indicators for inventory levels

### Business Operations
- **Day Management**: Start/end day workflow with cash counting
- **Till Auditing**: Real-time cash drawer reconciliation
- **Sales Reporting**: Comprehensive end-of-day reports
- **Transaction History**: Track all sales by payment type
- **Inventory Reports**: Starting vs. ending stock levels

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Efficient operation for power users
- **Accessibility**: ARIA labels and keyboard navigation
- **Clean Interface**: Zen-inspired minimalist design
- **Real-time Updates**: Instant feedback on all actions

## 🚀 Quick Start

### Installation

1. **Download the files**:
   ```bash
   git clone <repository-url>
   cd cashreg_w_mgmt
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in any modern web browser
   open index.html
   # or
   firefox index.html
   # or double-click index.html
   ```

3. **Optional: Use a local server** (recommended for development):
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```
   Then navigate to `http://localhost:8000`

### First Time Setup

1. **Start Your Day**:
   - Click "Start Day" button in the header
   - Verify inventory quantities (or upload a CSV)
   - Count and enter your starting cash
   - Click "Confirm Start Day"

2. **Add Your First Product**:
   - Enter a product code (001-010 are pre-loaded)
   - Or click "Inventory" to add custom products
   - Press Enter to add to cart

3. **Process a Sale**:
   - Add items to cart
   - Click "Cash" or "Card" payment button
   - Complete the transaction
   - Print receipt if needed

## 📖 Usage Guide

### Daily Workflow

#### 1. Starting Your Day
```
1. Click "Start Day" button
2. Review inventory summary
3. Count cash in drawer:
   - Enter quantity of each denomination
   - System calculates total automatically
4. Click "Confirm Start Day"
```

#### 2. Processing Transactions

**Adding Products**:
- Type product code in input field
- Press Enter or click checkmark button
- Product appears in cart with quantity and price

**Adjusting Quantities**:
- Click "Qty" button
- Enter desired quantity using number pad
- Click "Qty" again to confirm
- Add product code

**Applying Discounts**:
- Click "Discount" button
- Enter percentage (e.g., 10 for 10%)
- Click "Discount" again to apply
- Discount appears in subtotal section

**Voiding Items**:
- Click on item in cart to select it
- Click "Void Item" button
- Or press Delete key

**Clearing Transaction**:
- Click "Clear" button
- Confirm the action

#### 3. Payment Processing

**Cash Payment**:
```
1. Click "Cash" button (or press F1)
2. Enter amount tendered
3. System calculates change automatically
4. Click "Complete Sale"
5. Receipt displays automatically
```

**Card Payment**:
```
1. Click "Card" button (or press F2)
2. Click "Complete Sale"
3. Receipt displays automatically
```

#### 4. Inventory Management

**Adding Products**:
```
1. Click "Inventory" button
2. Click "Add Product"
3. Enter:
   - Product Code (unique identifier)
   - Product Name
   - Price
   - Stock Quantity
4. Click "Save"
```

**Editing Products**:
```
1. Open Inventory modal
2. Click "Edit" on desired product
3. Modify fields
4. Click "Save"
```

**Bulk Import via CSV**:
```
1. Prepare CSV file (see CSV_FORMAT.md)
2. Click "Upload Invoice (CSV)"
3. Select your CSV file
4. System imports and updates inventory
```

#### 5. Till Audit

Check your cash drawer at any time:
```
1. Click "Audit Till" button
2. View:
   - Starting cash
   - Cash sales
   - Expected cash in drawer
   - Total transactions
   - Card sales
   - Total sales
```

#### 6. Ending Your Day

```
1. Complete or clear any open transactions
2. Click "End Day" button
3. Review comprehensive report:
   - Sales summary (cash/card/total)
   - Transaction count and averages
   - Cash management details
   - Inventory adjustments
4. Click "Confirm End Day"
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Add product to cart |
| `F1` | Open cash payment modal |
| `F2` | Open card payment modal |
| `Delete` | Void selected item |
| `Escape` | Close any open modal |

## 🎨 Design Philosophy

Zen Register embodies six principles of digital zen:

1. **Ma (間)** - Negative Space: Emptiness is as important as content
2. **Wabi-Sabi (侘寂)** - Imperfect Beauty: Embrace simplicity and natural beauty
3. **Kanso (簡素)** - Simplicity: Eliminate clutter and unnecessary elements
4. **Koko (考古)** - Natural Materials: Replace ornate with simple and natural
5. **Shizen (自然)** - Naturalness: Create without pretense or artificiality
6. **Seijaku (静寂)** - Tranquility: Achieve peace through design

### Color Palette
- **Primary**: Deep forest (#2c3e50)
- **Accent**: Clear sky (#3498db)
- **Success**: Spring bamboo (#27ae60)
- **Warning**: Harvest moon (#f39c12)
- **Error**: Red maple (#e74c3c)

### Typography Scale
- Display: 32px (Mountain peaks)
- Heading: 24px (Forest canopy)
- Subheading: 18px (Tree branches)
- Body: 16px (Flowing water)
- Small: 14px (Gentle breeze)
- Caption: 12px (Morning dew)

## 🔧 Configuration

### Changing Tax Rate

Edit `app.js` line 13:
```javascript
const state = {
    taxRate: 0.08, // Change to your local tax rate (0.08 = 8%)
    // ...
};
```

### Pre-loaded Products

The system comes with 10 sample products. Edit the `productDatabase` object in `app.js` (starting at line 30):

```javascript
const productDatabase = {
    '001': { name: 'Green Tea', price: 3.50, stock: 50 },
    '002': { name: 'Matcha Latte', price: 5.00, stock: 30 },
    // Add your products here
};
```

### Customizing Styles

All design tokens are defined as CSS custom properties in `styles.css`:

```css
:root {
    --color-primary: #2c3e50;
    --space-md: 16px;
    /* Modify as needed */
}
```

## 📁 Project Structure

```
cashreg_w_mgmt/
├── index.html          # Main HTML structure
├── app.js              # Application logic and state management
├── styles.css          # Zen-inspired styling
├── README.md           # This file
├── invoice.csv         # Sample CSV import file
└── *.csv              # Additional sample data files
```

## 🔌 CSV Import Format

CSV files must include these columns (in any order):
- `code` - Unique product identifier
- `name` - Product name
- `price` - Product price (decimal)
- `stock` - Stock quantity (integer)

Example:
```csv
code,name,price,stock
001,Green Tea,3.50,50
002,Matcha Latte,5.00,30
003,Rice Bowl,8.50,25
```

**Important Notes**:
- Header row is required
- Column names are case-insensitive
- Existing products with matching codes will have stock added
- New products will be created
- Invalid rows are skipped with console warnings

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Minimum Requirements**:
- ES6 JavaScript support
- CSS Grid and Flexbox
- CSS Custom Properties
- LocalStorage (for future enhancements)

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (full two-column layout)
- **Tablet**: 768px - 1024px (single column, optimized controls)
- **Mobile**: < 768px (streamlined interface, thumb-friendly)

## ♿ Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ Respects `prefers-reduced-motion` setting
- ✅ Sufficient color contrast ratios (WCAG AA)
- ✅ Touch targets minimum 44px for mobile

## 🔒 Data Storage

**Current Version**: All data is stored in memory and resets on page reload.

**Future Enhancements**:
- LocalStorage for persistent data
- Backend API integration
- Database connectivity
- Cloud synchronization

## 🐛 Troubleshooting

### Products not appearing in cart
- Verify product code exists in database
- Check browser console for errors
- Ensure day has been started (for stock validation)

### CSV import fails
- Verify CSV has required columns: code, name, price, stock
- Check for proper CSV formatting (commas, no extra quotes)
- Ensure numeric values are valid (no currency symbols)

### Receipt not printing
- Check browser print settings
- Ensure pop-up blocker allows print dialog
- Try Print button in receipt modal

### Calculations seem incorrect
- Verify tax rate is set correctly
- Check for discount application
- Ensure quantities are correct

## 🚧 Known Limitations

- No persistent data storage (resets on page reload)
- No multi-user support
- No barcode scanner integration (manual entry only)
- No backend/database connectivity
- Tax calculation is simple (single rate, no complex tax rules)

## 🔮 Future Enhancements

Potential additions for production use:
- [ ] Backend integration for product database
- [ ] Real barcode scanner support
- [ ] Multiple payment methods (mobile pay, gift cards)
- [ ] Employee login and shift management
- [ ] Advanced sales reporting and analytics
- [ ] Inventory tracking with reorder alerts
- [ ] Customer loyalty program integration
- [ ] Multi-language support
- [ ] Offline mode with sync
- [ ] Receipt email capability
- [ ] Integration with accounting software

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

**Design Philosophy**: Inspired by Japanese aesthetic principles
**Created by**: Yuki "Interface"
**Version**: 1.0.0

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact: [your-email@example.com]

---

*"In a world of visual noise, the greatest luxury is simplicity."*

**Zen Register** - Where functionality meets tranquility.
