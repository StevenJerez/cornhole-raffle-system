import discoveredLogo from "@/assets/238e48a2b37d420a94e3a35f933279462009c100.png";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

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
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-[#2E4F4E] mb-2 leading-tight" style={{ fontSize: '28px' }}>
            Play Cornhole.<br />Win Meta Glasses.
          </h1>
          <p className="text-[#4A9D9C] font-medium mb-6" style={{ fontSize: '17px' }}>
            Play. Earn Tickets. Win Meta Glasses.
          </p>
          
          <button 
            className="bg-gradient-to-r from-[#F39C44] to-[#F5B668] text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all" 
            style={{ fontSize: '17px' }} 
            onClick={() => navigate('/ifa2026/register')}
          >
            Play to Win
          </button>
        </div>

        {/* Registration Benefits */}
        <section className="bg-gradient-to-r from-[#4A9D9C] to-[#7BC8CA] rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="text-center mb-4">
            <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>
              🎉 Register Now & Get:
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🎟️</div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1" style={{ fontSize: '16px' }}>1 Raffle Ticket</h4>
                  <p className="opacity-90" style={{ fontSize: '14px' }}>
                    Automatically entered to win Meta Glasses just for registering!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💎</div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1" style={{ fontSize: '16px' }}>100 DISC Credits FREE ($1,800 Value)</h4>
                  <p className="opacity-90" style={{ fontSize: '14px' }}>
                    Redeem your credits within 90 days—exclusively for registrants!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#2E4F4E] mb-6 text-center">
            How It Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#7BC8CA] text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-[#2E4F4E] mb-1">Scan & Register</h3>
                <p className="text-sm text-gray-600">
                  Scan the QR code and complete quick registration.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#7BC8CA] text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-[#2E4F4E] mb-1">Book & Get 15 Bonus Tickets</h3>
                <p className="text-sm text-gray-600">
                  Book a free 30-min Strategic Franchise Group Hiring Session and get 15 bonus tickets.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#7BC8CA] text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-[#2E4F4E] mb-1">Play & Win</h3>
                <p className="text-sm text-gray-600">
                  Go to the cornhole station and earn raffle tickets!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scoring Rules */}
        <section className="bg-gradient-to-br from-[#4A9D9C] to-[#7BC8CA] rounded-2xl shadow-md p-6 mb-6 text-white">
          <h2 className="font-bold mb-4 text-center" style={{ fontSize: '22px' }}>
            Scoring Rules
          </h2>
          
          <p className="mb-4 text-center opacity-90" style={{ fontSize: '14px' }}>
            Each registration includes 3 cornhole attempts:
          </p>

          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
              <span className="text-2xl">🎯</span>
              <span className="flex-1 mx-3 font-medium">Bag in hole</span>
              <span className="font-bold" style={{ fontSize: '17px' }}>+10 tickets</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
              <span className="text-2xl">🎲</span>
              <span className="flex-1 mx-3 font-medium">Board hit</span>
              <span className="font-bold" style={{ fontSize: '17px' }}>+5 tickets</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
              <span className="text-2xl">❌</span>
              <span className="flex-1 mx-3 font-medium">Miss</span>
              <span className="font-bold" style={{ fontSize: '17px' }}>+0 tickets</span>
            </div>
          </div>
        </section>

        {/* Bonus Section */}
        <section className="bg-gradient-to-r from-[#F39C44] to-[#F5B668] rounded-2xl shadow-md p-6 mb-6 text-white">
          <div className="text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-bold mb-3" style={{ fontSize: '20px' }}>Get +15 Bonus Tickets</h3>
            <p className="opacity-95" style={{ fontSize: '14px' }}>
              Schedule your free 30-minute Strategic Franchise Group Hiring Session and receive 15 extra raffle tickets.
            </p>
          </div>
        </section>

        {/* Live Draw */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#2E4F4E] mb-4 text-center">
            Live Draw
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Winners will be announced live at IFA 2026!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-[#4A9D9C]">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Feb 25, 2026 @ 3:30 PM</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-[#4A9D9C]">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Booth 452 • Las Vegas Time</span>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center pt-4 pb-8">
          <button 
            className="bg-gradient-to-r from-[#4A9D9C] to-[#7BC8CA] text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all text-lg w-full" 
            onClick={() => navigate('/ifa2026/register')}
          >
            Get Started Now
          </button>
        </div>
      </main>
    </div>
  );
}
