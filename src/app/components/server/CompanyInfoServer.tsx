// Server component for company information
// This component fetches and renders static company data on the server

interface CompanyInfo {
  name: string;
  founded: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  certifications: string[];
}

async function getCompanyInfo(): Promise<CompanyInfo> {
  // Simulate fetching company data from a database or API
  await new Promise(resolve => setTimeout(resolve, 1));
  
  return {
    name: "Thiasil",
    founded: "2010",
    location: "Mumbai, Maharashtra, India",
    email: "thiaglasswork@gmail.com",
    phone: "+91 98205 76045",
    description: "Leading manufacturer of high-quality laboratory glassware and scientific equipment.",
    certifications: ["ISO 9001:2015", "CE Certified", "FDA Approved"]
  };
}

// Server component for company stats
export async function CompanyStatsServer() {
  const companyInfo = await getCompanyInfo();
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - parseInt(companyInfo.founded);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="text-3xl font-bold text-white mb-2">{yearsInBusiness}+</div>
        <div className="text-white/80">Years of Excellence</div>
      </div>
      <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="text-3xl font-bold text-white mb-2">{companyInfo.certifications.length}</div>
        <div className="text-white/80">Quality Certifications</div>
      </div>
      <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="text-3xl font-bold text-white mb-2">1000+</div>
        <div className="text-white/80">Happy Customers</div>
      </div>
    </div>
  );
}

// Server component for contact information
export async function ContactInfoServer() {
  const companyInfo = await getCompanyInfo();
  
  return (
    <div className="bg-white/5 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-blue-400">📧</span>
          <span className="text-white">{companyInfo.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-400">📞</span>
          <span className="text-white">{companyInfo.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-400">📍</span>
          <span className="text-white">{companyInfo.location}</span>
        </div>
      </div>
    </div>
  );
}

// Server component for certifications
export async function CertificationsServer() {
  const companyInfo = await getCompanyInfo();
  
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Quality Certifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {companyInfo.certifications.map((cert, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
            <span className="text-white font-medium">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}