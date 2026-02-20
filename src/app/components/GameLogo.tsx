export function GameLogo() {
  return (
    <div className="inline-block">
      <div className="relative w-[180px] h-[200px] mx-auto">
        {/* Large Hexagon background with gradient */}
        <svg width="180" height="200" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          <path 
            d="M90 10L165 55V145L90 190L15 145V55L90 10Z" 
            fill="url(#hexGradient)"
            stroke="#2E4F4E"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="hexGradient" x1="90" y1="10" x2="90" y2="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A9D9C"/>
              <stop offset="1" stopColor="#7BC8CA"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* Cornhole bag in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Orange bag shape - rounded square */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#F39C44] to-[#F5B668] rounded-xl shadow-lg border-4 border-white relative transform rotate-3">
              {/* Dots pattern on bag */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-2 p-3">
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                </div>
              </div>
              
              {/* Number badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-[#F39C44]">
                <span className="text-[#F39C44] font-extrabold" style={{ fontSize: '20px' }}>3</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text label at bottom */}
        <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
          <div className="bg-white px-6 py-2 rounded-full shadow-lg border-2 border-[#4A9D9C]">
            <span className="font-extrabold tracking-wide text-[#2E4F4E]" style={{ fontSize: '16px' }}>
              BAG THE META
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
