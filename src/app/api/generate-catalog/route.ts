import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import puppeteer from 'puppeteer';

interface ProductVariant {
  name: string;
  capacity?: string;
  packaging?: string;
  price: string;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'made_to_order' | 'limited_stock';
}

interface Product {
  name: string;
  category: string;
  categorySlug: string;
  catNo?: string;
  description?: string;
}

interface ProductsData {
  products: Product[];
  productVariants: Record<string, { variants: ProductVariant[] }>;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Read current product data
    const productsPath = path.join(process.cwd(), 'src/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // Get the base URL from request headers
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Generate HTML content for the catalog
    const htmlContent = generateCatalogHTML(productsData, baseUrl);

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    
    // Set viewport for better PDF layout
    await page.setViewport({ width: 1200, height: 800 });
    
    // Set content and wait for images to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait for images to load or fail
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;
        
        if (totalImages === 0) {
          resolve();
          return;
        }
        
        images.forEach((img) => {
          if (img.complete) {
            loadedImages++;
            if (loadedImages === totalImages) resolve();
          } else {
            img.onload = () => {
              loadedImages++;
              if (loadedImages === totalImages) resolve();
            };
            img.onerror = () => {
              loadedImages++;
              if (loadedImages === totalImages) resolve();
            };
          }
        });
      });
    });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="thiasil-catalog.pdf"',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error generating catalog PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate catalog PDF' },
      { status: 500 }
    );
  }
}

function generateCatalogHTML(productsData: ProductsData, baseUrl: string): string {
  const { products, productVariants } = productsData;
  
  // Helper function to get base catalog number for image paths
  const getBaseCatalogNumber = (catNo: string | undefined): string => {
    if (!catNo) return '';
    // Handle both "1100 Series" and "1100/50" formats
    return catNo.split(/[\s\/]/)[0];
  };
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thiasil Labware Catalog</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        
        .header {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin-bottom: 40px;
        }
        
        .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 1.2em;
          opacity: 0.9;
        }
        
        .catalog-info {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .catalog-info p {
          margin: 5px 0;
          font-size: 0.9em;
          color: #666;
        }
        
        .category-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        
        .category-title {
          font-size: 1.8em;
          color: #2c3e50;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .product-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 15px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.9em;
        }
        
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .product-title {
          font-size: 1.2em;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .product-description {
          color: #666;
          margin-bottom: 15px;
          font-size: 0.9em;
        }
        
        .variants-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 0.85em;
        }
        
        .variants-table th,
        .variants-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        .variants-table th {
          background: #f8f9fa;
          font-weight: bold;
        }
        
        .price {
          font-weight: bold;
          color: #e74c3c;
        }
        
        .stock-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8em;
          font-weight: bold;
        }
        
        .in-stock { background: #d4edda; color: #155724; }
        .out-of-stock { background: #f8d7da; color: #721c24; }
        .made-to-order { background: #fff3cd; color: #856404; }
        .limited-stock { background: #d1ecf1; color: #0c5460; }
        
        .footer {
          text-align: center;
          padding: 30px 20px;
          margin-top: 40px;
          border-top: 2px solid #ddd;
          color: #666;
        }
        
        @media print {
          .category-section {
            page-break-inside: avoid;
          }
          
          .product-card {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thiasil Labware</h1>
        <p>Premium Laboratory Equipment & Supplies</p>
      </div>
      
      <div class="catalog-info">
        <p><strong>Catalog Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p><strong>Total Products:</strong> ${products.length}</p>
        <p><strong>Categories:</strong> ${Object.keys(productVariants).length}</p>
      </div>
      
      ${products.map(product => {
        const baseCatalogNumber = getBaseCatalogNumber(product.catNo);
        const imagePath = `${baseUrl}/images/products/${baseCatalogNumber}.webp`;
        
        return `
          <div class="category-section">
            <h2 class="category-title">${product.category}</h2>
            <div class="products-grid">
              <div class="product-card">
                <div class="product-image">
                  <img src="${imagePath}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='Image not available';">
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || 'No description available'}</p>
                
                ${productVariants[product.categorySlug] ? `
                  <table class="variants-table">
                    <thead>
                      <tr>
                        <th>Variant</th>
                        <th>Capacity</th>
                        <th>Packaging</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productVariants[product.categorySlug].variants.map(variant => `
                        <tr>
                          <td>${variant.name}</td>
                          <td>${variant.capacity || '-'}</td>
                          <td>${variant.packaging || '-'}</td>
                          <td class="price">${variant.price}</td>
                          <td>
                            <span class="stock-status ${variant.stockStatus || 'in-stock'}">
                              ${getStockStatusText(variant.stockStatus)}
                            </span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                ` : '<p>No variants available</p>'}
              </div>
            </div>
          </div>
        `;
      }).join('')}
      
      <div class="footer">
        <p><strong>Thiasil Labware</strong> - Premium Laboratory Equipment</p>
        <p>For inquiries and orders, please contact us</p>
        <p>This catalog is automatically generated and reflects current pricing and availability</p>
      </div>
    </body>
    </html>
  `;
}

function getStockStatusText(status?: string): string {
  switch (status) {
    case 'in_stock': return 'In Stock';
    case 'out_of_stock': return 'Out of Stock';
    case 'made_to_order': return 'Made to Order';
    case 'limited_stock': return 'Limited Stock';
    default: return 'In Stock';
  }
} 