import { Organization, Product, WebSite, BreadcrumbList } from 'schema-dts';

interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
}

export function OrganizationStructuredData({ 
  name = "Thiasil",
  url = "https://thiasil.com",
  logo = "https://thiasil.com/images/logo.png",
  description = "Premium manufacturer of individually oxy-fired laboratory glassware and silica crucibles. Quality rivaling international standards with competitive pricing.",
  address = {
    streetAddress: "No. 3/16, Mahalaxmi Industrial Estate, DC Road, Lower Parel",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400013",
    addressCountry: "IN"
  },
  contactPoint = {
    telephone: "+91-98205-76045",
    contactType: "customer service",
    email: "thiaglasswork@gmail.com"
  }
}: OrganizationStructuredDataProps) {
  const organizationData: Organization = {
    "@type": "Organization",
    "@id": `${url}#organization`,
    name,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: "200",
      height: "200"
    },
    description,
    address: {
      "@type": "PostalAddress",
      ...address
    },
    contactPoint: {
      "@type": "ContactPoint",
      ...contactPoint
    },
    foundingDate: "2010",
    sameAs: [
      "https://www.linkedin.com/company/thiasil",
      "https://twitter.com/thiasil"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...organizationData
        })
      }}
    />
  );
}

interface WebSiteStructuredDataProps {
  url?: string;
  name?: string;
  description?: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

export function WebSiteStructuredData({
  url = "https://thiasil.com",
  name = "Thiasil",
  description = "Premium Laboratory Glassware & Silica Crucibles Manufacturer",
  potentialAction = {
    target: "https://thiasil.com/products?search={search_term_string}",
    queryInput: "required name=search_term_string"
  }
}: WebSiteStructuredDataProps) {
  const websiteData: WebSite = {
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name,
    description,
    publisher: {
      "@id": `${url}#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: potentialAction.target
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...websiteData
        })
      }}
    />
  );
}

interface ProductStructuredDataProps {
  product: {
    name: string;
    catNo: string;
    description?: string;
    image?: string;
    category?: string;
    price?: string;
    priceRange?: string;
    availability?: string;
  };
  url: string;
}

export function ProductStructuredData({ product, url }: ProductStructuredDataProps) {
  // Extract price information
  const extractPrice = (priceStr: string) => {
    const match = priceStr.match(/₹([\d,.]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  };

  const price = product.price ? extractPrice(product.price) : 
                product.priceRange ? extractPrice(product.priceRange) : null;

  const productData: Product = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description || `${product.name} - Premium laboratory glassware from Thiasil. Cat No: ${product.catNo}`,
    image: product.image || "https://thiasil.com/images/product-placeholder.jpg",
    sku: product.catNo,
    mpn: product.catNo,
    brand: {
      "@type": "Brand",
      name: "Thiasil"
    },
    manufacturer: {
      "@id": "https://thiasil.com#organization"
    },
    category: product.category || "Laboratory Glassware",
    ...(price && {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "INR",
        price: price.toString(),
        availability: product.availability === "in_stock" ? 
          "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@id": "https://thiasil.com#organization"
        }
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...productData
        })
      }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url?: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const breadcrumbData: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...breadcrumbData
        })
      }}
    />
  );
}