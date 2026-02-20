import { useState } from "react";
import { useNavigate } from "react-router";
import discoveredLogo from "@/assets/238e48a2b37d420a94e3a35f933279462009c100.png";

export function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Bot check - honeypot field should be empty
    if (honeypot) {
      navigate('/confirmation');
      return;
    }
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      setError("Please enter valid names");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/ifa2026/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          timestamp: Date.now(),
        }),
      });
      
      if (response.ok) {
        navigate('/confirmation');
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF5F6] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="max-w-md mx-auto text-center">
          <img src={discoveredLogo} alt="Discovered" className="h-12 mx-auto mb-2" />
          <p className="text-[#4A9D9C] font-medium" style={{ fontSize: '13px' }}>
            IFA 2026 • Feb 23–25 • Mandalay Bay, Las Vegas
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-[#2E4F4E] mb-2" style={{ fontSize: '28px' }}>
            Register to Win!
          </h1>
          <p className="text-[#4A9D9C]" style={{ fontSize: '16px' }}>
            Complete your registration to get started
          </p>
        </div>

        {/* Registration Form */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            {/* Honeypot field - hidden from users, visible to bots */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px' }}
              tabIndex={-1}
              autoComplete="off"
            />
            
            <div className="space-y-5">
              <div>
                <label className="block text-[#2E4F4E] font-medium mb-2" style={{ fontSize: '15px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9D9C] focus:border-transparent"
                  style={{ fontSize: '16px' }}
                  placeholder="Enter your first name"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-[#2E4F4E] font-medium mb-2" style={{ fontSize: '15px' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9D9C] focus:border-transparent"
                  style={{ fontSize: '16px' }}
                  placeholder="Enter your last name"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-[#2E4F4E] font-medium mb-2" style={{ fontSize: '15px' }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9D9C] focus:border-transparent"
                  style={{ fontSize: '16px' }}
                  placeholder="your.email@company.com"
                  maxLength={100}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-4" style={{ fontSize: '14px' }}>
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-gradient-to-r from-[#F39C44] to-[#F5B668] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '17px' }}
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </button>

            <p className="text-center text-gray-500 mt-4" style={{ fontSize: '13px' }}>
              By registering, you agree to receive promotional communications
            </p>
          </form>
        </section>

        {/* What You Get Section */}
        <div className="mb-8">
          <h2 className="font-bold text-[#2E4F4E] text-center mb-6" style={{ fontSize: '24px' }}>
            What You Get 🎉
          </h2>
          
          <div className="space-y-5">
            {/* Raffle Ticket */}
            <div className="bg-gradient-to-br from-[#4A9D9C] to-[#7BC8CA] rounded-2xl shadow-md p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🎟️</div>
                <div className="flex-1">
                  <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>
                    1 Raffle Ticket
                  </h3>
                  <p className="opacity-95 leading-relaxed" style={{ fontSize: '15px' }}>
                    You're automatically entered to win Meta Glasses just for signing up!
                  </p>
                </div>
              </div>
            </div>
            
            {/* DISC Credits */}
            <div className="bg-gradient-to-br from-[#F39C44] to-[#F5B668] rounded-2xl shadow-md p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="text-5xl">💎</div>
                <div className="flex-1">
                  <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>
                    100 DISC Credits FREE
                  </h3>
                  <p className="opacity-95 mb-2 leading-relaxed" style={{ fontSize: '15px' }}>
                    Worth <strong>$1,800</strong> in value!
                  </p>
                  <p className="opacity-90" style={{ fontSize: '14px' }}>
                    Valid for 90 days—exclusively for registrants
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cornhole Attempts */}
            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-[#7BC8CA]">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#2E4F4E] mb-3" style={{ fontSize: '20px' }}>
                    3 Cornhole Attempts
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed" style={{ fontSize: '15px' }}>
                    Earn more raffle tickets by playing!
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 pl-16">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>Bag in hole</span>
                  <span className="font-bold text-[#4A9D9C]" style={{ fontSize: '16px' }}>+10 tickets</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎲</span>
                  <span className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>Board hit</span>
                  <span className="font-bold text-[#4A9D9C]" style={{ fontSize: '16px' }}>+5 tickets</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <span className="text-gray-700 flex-1" style={{ fontSize: '15px' }}>Miss</span>
                  <span className="font-bold text-gray-500" style={{ fontSize: '16px' }}>+0 tickets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-[#4A9D9C] font-medium hover:underline"
            style={{ fontSize: '15px' }}
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
