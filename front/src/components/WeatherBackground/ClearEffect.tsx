

const birdsData = [
    { id: 1, top: '25%', scale: 0.6, delay: 0, duration: 25 },
    { id: 2, top: '35%', scale: 0.4, delay: 5, duration: 35 },
    { id: 3, top: '15%', scale: 0.8, delay: 12, duration: 20 },
    { id: 4, top: '40%', scale: 0.5, delay: 18, duration: 30 },
];

export default function ClearEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#2980B9] to-[#6DD5FA]">
            {/* The Sun */}
            <div className="absolute top-[15%] right-[20%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-400 shadow-[0_0_80px_rgba(253,224,71,0.8)] animate-pulse-slow flex items-center justify-center">
                
                {/* Sun Glow and Rays */}
                <div className="absolute w-[180%] h-[180%] rounded-full bg-yellow-300/30 blur-2xl animate-spin-slow-reverse"></div>
                <div className="absolute w-[250%] h-[250%] rounded-full bg-yellow-100/10 blur-3xl animate-spin-slow"></div>
            </div>

            {/* Birds */}
            {birdsData.map(bird => (
                <div 
                    key={bird.id}
                    className="absolute left-[-10%] opacity-0 flex animate-fly"
                    style={{
                        top: bird.top,
                        // @ts-expect-error
                        '--scale': bird.scale,
                        animationDuration: `${bird.duration}s`,
                        animationDelay: `${bird.delay}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear'
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-flap text-white/60 drop-shadow-sm">
                        <path d="M12 15s-2-4-8-2c2 2 5 3 8 5 3-2 6-3 8-5-6-2-8 2-8 2z" fill="currentColor"/>
                    </svg>
                </div>
            ))}

            <style>{`
                @keyframes pulseSlow {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                @keyframes spinSlow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spinSlowReverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }

                /* Bird Keyframes */
                @keyframes fly {
                    0% { transform: translateX(0) translateY(0) scale(var(--scale)); opacity: 0; }
                    5% { opacity: 0.8; }
                    95% { opacity: 0.8; }
                    100% { transform: translateX(120vw) translateY(-15vh) scale(var(--scale)); opacity: 0; }
                }
                @keyframes flap {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(-0.4); } 
                }

                .animate-pulse-slow { 
                    animation: pulseSlow 6s ease-in-out infinite; 
                }
                .animate-spin-slow {
                    animation: spinSlow 30s linear infinite;
                }
                .animate-spin-slow-reverse {
                    animation: spinSlowReverse 25s linear infinite;
                }
                .animate-fly {
                    animation-name: fly;
                }
                .animate-flap {
                    animation: flap 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    transform-origin: center;
                }
            `}</style>
        </div>
    );
}
