
export default function CloudsEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[-20%] w-[400px] h-[100px] bg-white/20 rounded-full blur-3xl animate-cloud-slow"></div>
            <div className="absolute top-[30%] right-[-20%] w-[500px] h-[150px] bg-white/10 rounded-full blur-3xl animate-cloud-fast"></div>
            <div className="absolute top-[50%] left-[10%] w-[300px] h-[120px] bg-white/20 rounded-full blur-3xl animate-cloud-medium"></div>
            
            <style>{`
                @keyframes cloudSlow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(150vw); }
                }
                @keyframes cloudFast {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-150vw); }
                }
                @keyframes cloudMedium {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(50vw); }
                    100% { transform: translateX(0); }
                }
                .animate-cloud-slow { animation: cloudSlow 60s linear infinite; }
                .animate-cloud-fast { animation: cloudFast 40s linear infinite; }
                .animate-cloud-medium { animation: cloudMedium 50s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
