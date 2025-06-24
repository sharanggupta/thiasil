# Thiasil Admin Panel

## Overview
The admin panel provides secure access to bulk price management for the Thiasil product catalog.

## Access
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `thiasil2024`

## Features

### Authentication
- Secure login system with username/password
- Session-based authentication
- Automatic logout functionality

### Bulk Price Updates
- **Category Selection**: Update prices for specific categories or all products
- **Percentage Changes**: Apply percentage-based price adjustments (-50% to +100%)
- **Real-time Updates**: Changes are immediately reflected in the product catalog
- **Audit Trail**: Shows count of updated items

### Product Management
- **Live Preview**: View all current products with their updated prices
- **Category Filtering**: Browse products by category
- **Price Range Display**: Shows current price ranges for each product

## Security Notes

### Production Deployment
For production deployment, consider the following security improvements:

1. **Environment Variables**: Move credentials to environment variables
   ```bash
   ADMIN_USERNAME=your_secure_username
   ADMIN_PASSWORD=your_secure_password
   ```

2. **HTTPS**: Ensure the admin panel is served over HTTPS

3. **Rate Limiting**: Implement rate limiting for login attempts

4. **Session Management**: Add proper session management with expiration

5. **Access Logging**: Log admin actions for audit purposes

### Current Implementation
- Credentials are hardcoded in the application (for development)
- No session persistence (refreshing the page requires re-login)
- Basic authentication without additional security layers

## API Endpoints

### Authentication
- **POST** `/api/admin/update-prices`
  - Body: `{ username, password, category, priceChangePercent }`
  - Response: `{ success, updatedCount, message }`

### Product Data
- **GET** `/api/products`
  - Response: `{ products, categories }`

## Usage Examples

### Update All Prices by 10%
1. Navigate to `/admin`
2. Login with credentials
3. Select "All Categories"
4. Enter "10" in percentage field
5. Click "Update Prices"

### Update Specific Category by -5%
1. Navigate to `/admin`
2. Login with credentials
3. Select specific category (e.g., "Crucibles")
4. Enter "-5" in percentage field
5. Click "Update Prices"

## File Structure
```
src/app/admin/
├── page.jsx                    # Admin panel UI
└── api/admin/update-prices/
    └── route.js               # Price update API endpoint
```

## Data Storage
- Product data is stored in `src/data/products.json`
- Changes are written directly to this file
- No database required for this implementation

## Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Glassmorphism UI components 