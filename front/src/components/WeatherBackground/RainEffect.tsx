import { useEffect, useState } from 'react';

interface Drop {
    id: number;
    left: string;
    top: string;
    width: string;
    height: string;
    animationDuration: string;
    animationDelay: string;
    opacity: number;
    isSliding: boolean;
}

interface Props {
    isHeavy?: boolean;
}

export default function RainEffect({ isHeavy = false }: Props) {
    const [drops, setDrops] = useState<Drop[]>([]);

    useEffect(() => {
        const count = isHeavy ? 300 : 120;
        const newDrops = Array.from({ length: count }).map((_, i) => {
            const size = (Math.random() * 6 + 3) * (isHeavy ? 1.2 : 1);
            const isSliding = Math.random() > (isHeavy ? 0.3 : 0.6);
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${(Math.random() * 120) - 20}%`,
                width: `${size}px`,
                height: `${size * (isSliding ? 2.5 : 1.2)}px`,
                animationDuration: isSliding ? `${Math.random() * (isHeavy ? 1 : 2) + 0.5}s` : `${Math.random() * 4 + 3}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * (isHeavy ? 0.6 : 0.4) + 0.3,
                isSliding
            };
        });
        setDrops(newDrops);
    }, [isHeavy]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {drops.map(drop => (
                <div
                    key={drop.id}
                    className={`absolute bg-gradient-to-b from-white/60 to-white/10 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),_0_1px_2px_rgba(0,0,0,0.15)] ${drop.isSliding ? 'animate-slide-down' : 'animate-fade-in-out'}`}
                    style={{
                        left: drop.left,
                        top: drop.top,
                        width: drop.width,
                        height: drop.height,
                        borderRadius: drop.isSliding ? '50% 50% 40% 40% / 60% 60% 40% 40%' : '50%',
                        animationDuration: drop.animationDuration,
                        animationDelay: drop.animationDelay,
                        animationIterationCount: 'infinite',
                        animationFillMode: 'both',
                        opacity: drop.opacity
                    }}
                />
            ))}
            <style>{`
                @keyframes slide-down {
                    0% { transform: translateY(0) scaleY(1); opacity: 0; }
                    10% { opacity: 1; transform: translateY(2vh) scaleY(1.1); }
                    30% { transform: translateY(10vh) scaleY(1.2); }
                    70% { transform: translateY(50vh) scaleY(1.4); }
                    100% { transform: translateY(120vh) scaleY(2); opacity: 0; }
                }
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: scale(0.5); }
                    30% { opacity: 1; transform: scale(1); }
                    70% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.8); }
                }
                .animate-slide-down {
                    animation-name: slide-down;
                    /* cubic bezier to simulate friction on glass then falling fast */
                    animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.1); 
                }
                .animate-fade-in-out {
                    animation-name: fade-in-out;
                    animation-timing-function: ease-in-out;
                }
            `}</style>
        </div>
    );
}
