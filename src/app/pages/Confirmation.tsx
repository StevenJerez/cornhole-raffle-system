import { useNavigate } from "react-router";
import discoveredLogo from "@/assets/238e48a2b37d420a94e3a35f933279462009c100.png";
import { CheckCircle, Calendar, Trophy } from "lucide-react";

export default function Confirmation() {
  const navigate = useNavigate();

  const handleScheduleDemo = () => {
    // Here you would integrate with your calendar/scheduling system
    window.open("https://calendly.com/discovered-ats/franchise-groups", "_blank");
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

      <main className="max-w-md mx-auto px-4 py-8 pb-28">
        {/* Success Message */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-bold text-[#2E4F4E] mb-3" style={{ fontSize: '28px' }}>
            You're Registered!
          </h1>
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: '15px' }}>
            Check your email for confirmation
          </p>
        </div>

        {/* CTA: Schedule Demo - PRIMARY */}
        <section className="bg-gradient-to-br from-[#F39C44] to-[#F5B668] rounded-2xl shadow-xl p-8 mb-6 text-white relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 opacity-10 text-9xl">🎟️</div>
          
          <div className="relative z-10">
            <div className="text-center mb-5">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="font-bold mb-3" style={{ fontSize: '26px' }}>
                Unlock 15 Bonus Tickets!
              </h2>
              <p className="opacity-95 leading-relaxed mb-2" style={{ fontSize: '17px' }}>
                Schedule a <strong>FREE 30-minute session</strong> with Strategic Franchise Group
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-4 mb-5">
                <p className="font-bold" style={{ fontSize: '24px' }}>+15 Raffle Tickets</p>
                <p className="opacity-90" style={{ fontSize: '14px' }}>More tickets = Better chances!</p>
              </div>
            </div>

            <button
              onClick={handleScheduleDemo}
              className="w-full bg-white text-[#F39C44] font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-3"
              style={{ fontSize: '18px' }}
            >
              <Calendar className="w-5 h-5" />
              Schedule Free Session Now
            </button>
            <p className="text-center text-white/80 text-sm">No obligation • 30 minutes • Instant bonus</p>
          </div>
        </section>

        {/* Current Status - Compact */}
        <section className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-[#2E4F4E] mb-4 text-center" style={{ fontSize: '18px' }}>
            Your Current Rewards
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#EEF5F6] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎟️</span>
                <span className="text-gray-700" style={{ fontSize: '15px' }}>Raffle Tickets</span>
              </div>
              <span className="font-bold text-[#4A9D9C]" style={{ fontSize: '18px' }}>1 ticket</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#EEF5F6] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <span className="text-gray-700" style={{ fontSize: '15px' }}>DISC Credits</span>
              </div>
              <span className="font-bold text-[#F39C44]" style={{ fontSize: '18px' }}>100 credits</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#EEF5F6] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="text-gray-700" style={{ fontSize: '15px' }}>Cornhole Attempts</span>
              </div>
              <span className="font-bold text-[#7BC8CA]" style={{ fontSize: '18px' }}>3 attempts</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-[#F39C44]/10 to-[#F5B668]/10 rounded-lg border border-[#F39C44]/20">
            <p className="text-center text-sm text-gray-700">
              💡 <strong>Play cornhole at our booth</strong> to earn up to 30 more tickets!
            </p>
          </div>
        </section>

        {/* Prize Information */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="text-center mb-5">
            <Trophy className="w-12 h-12 text-[#F39C44] mx-auto mb-3" />
            <h2 className="font-bold text-[#2E4F4E] mb-2" style={{ fontSize: '22px' }}>
              What You Can Win
            </h2>
            <p className="text-gray-600 mb-1" style={{ fontSize: '14px' }}>
              Live Drawing: <strong>Feb 25, 2026 @ 3:30 PM</strong>
            </p>
            <p className="text-[#4A9D9C] font-medium" style={{ fontSize: '13px' }}>
              Visit us at Booth 452
            </p>
          </div>

          <div className="space-y-4">
            {/* Grand Prize */}
            <div className="bg-gradient-to-br from-[#4A9D9C] to-[#7BC8CA] rounded-xl p-5 text-white">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ fontSize: '18px' }}>
                    Grand Prize Winner
                  </h3>
                </div>
              </div>
              <div className="space-y-2 pl-11">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👓</span>
                  <span style={{ fontSize: '15px' }}>Meta Glasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <span style={{ fontSize: '15px' }}>+ 100 DISC Credits</span>
                </div>
              </div>
            </div>

            {/* Additional Winners */}
            <div className="bg-gradient-to-br from-[#F39C44] to-[#F5B668] rounded-xl p-5 text-white">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🎖️</span>
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ fontSize: '18px' }}>
                    5 Additional Winners
                  </h3>
                </div>
              </div>
              <div className="pl-11">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">💎</span>
                  <div>
                    <p className="font-bold" style={{ fontSize: '16px' }}>1,250 DISC Credits Each</p>
                    <p className="opacity-90" style={{ fontSize: '14px' }}>Valued at $6,750 per winner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/ifa2026/')}
            className="text-[#4A9D9C] font-medium hover:underline"
            style={{ fontSize: '15px' }}
          >
            ← Back to Home
          </button>
        </div>
      </main>

      {/* Floating CTA Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-4 px-4 shadow-2xl z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleScheduleDemo}
            className="w-full bg-gradient-to-r from-[#F39C44] to-[#F5B668] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 animate-pulse"
            style={{ fontSize: '17px' }}
          >
            <span className="text-2xl">🎁</span>
            Get 15 Bonus Tickets Now!
          </button>
        </div>
      </div>
    </div>
  );
}