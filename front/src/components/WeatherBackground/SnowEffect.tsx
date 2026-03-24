import { useEffect, useState } from 'react';

interface Flake {
    id: number;
    left: string;
    width: string;
    height: string;
    animationDuration: string;
    animationDelay: string;
    opacity: number;
}

export default function SnowEffect() {
    const [flakes, setFlakes] = useState<Flake[]>([]);

    useEffect(() => {
        // Generic falling snow effect
        const newFlakes = Array.from({ length: 150 }).map((_, i) => {
            const size = Math.random() * 4 + 2; 
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.6 + 0.3
            };
        });
        setFlakes(newFlakes);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {flakes.map(flake => (
                <div 
                    key={flake.id}
                    className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-snow-fall"
                    style={{
                        left: flake.left,
                        top: '-5%',
                        width: flake.width,
                        height: flake.height,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear',
                        opacity: flake.opacity
                    }}
                />
            ))}
            <style>{`
                @keyframes snow-fall {
                    0% { transform: translateY(0vh) translateX(0); }
                    50% { transform: translateY(50vh) translateX(1vw); }
                    100% { transform: translateY(110vh) translateX(-1vw); }
                }

                .animate-snow-fall {
                    animation-name: snow-fall;
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    );
}
