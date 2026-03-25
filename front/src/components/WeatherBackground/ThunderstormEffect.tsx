import { useEffect, useState } from 'react';
import RainEffect from './RainEffect';

export default function ThunderstormEffect({ isHeavy = false }: { isHeavy?: boolean }) {
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const triggerFlash = () => {
            setFlash(true);
            setTimeout(() => setFlash(false), 200);
            
            setTimeout(() => {
                setFlash(true);
                setTimeout(() => setFlash(false), 200);
            }, 300);

            const nextFlash = Math.random() * 5000 + 3000;
            setTimeout(triggerFlash, nextFlash);
        };

        const timeout = setTimeout(triggerFlash, Math.random() * 3000 + 1000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <RainEffect isHeavy={isHeavy} />
            <div 
                className={`absolute inset-0 bg-white transition-opacity duration-75 ${flash ? 'opacity-40' : 'opacity-0'}`}
            ></div>
        </div>
    );
}
