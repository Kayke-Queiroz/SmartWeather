import RainEffect from './RainEffect';
import SnowEffect from './SnowEffect';
import CloudsEffect from './CloudsEffect';
import ClearEffect from './ClearEffect';
import ThunderstormEffect from './ThunderstormEffect';
import { AnimatePresence, motion } from 'framer-motion';

interface WeatherBackgroundProps {
    weatherMain: string;
    weatherDescription?: string;
    temperature?: number;
}

export default function WeatherBackground({ weatherMain, weatherDescription, temperature }: WeatherBackgroundProps) {
    const renderEffect = () => {
        if (!weatherMain) return null; // No effect on initial load maybe?

        const main = weatherMain?.toLowerCase();

        // Show snow for freezing temperatures unless it's raining/storming
        if (temperature !== undefined && temperature <= 0 && !['rain', 'drizzle', 'thunderstorm', 'snow'].includes(main)) {
            return <SnowEffect />;
        }

        // Keyword-based detection from both main and description fields
        const desc = weatherDescription?.toLowerCase() || '';
        const combined = `${main} ${desc}`;

        const stormKeywords = ['thunderstorm', 'storm', 'squall', 'tornado', 'lightning'];
        const snowKeywords  = ['snow', 'sleet', 'blizzard', 'ice pellet', 'flurr', 'freezing'];
        const rainKeywords  = ['rain', 'drizzle', 'shower', 'precipit', 'sprinkle'];
        const fogKeywords   = ['fog', 'mist', 'haze', 'smoke', 'dust', 'ash', 'sand'];

        const isHeavy = ['heavy', 'extreme', 'violent', 'torrent'].some(kw => combined.includes(kw));

        if (stormKeywords.some(kw => combined.includes(kw))) return <ThunderstormEffect isHeavy={isHeavy} />;
        if (snowKeywords.some(kw => combined.includes(kw)))  return <SnowEffect />;
        if (rainKeywords.some(kw => combined.includes(kw))) {
            return isHeavy ? <ThunderstormEffect isHeavy={true} /> : <RainEffect isHeavy={false} />;
        }
        if (fogKeywords.some(kw => combined.includes(kw))) return <CloudsEffect />;

        switch (main) {
            case 'clouds':
                return <CloudsEffect />;
            case 'clear':
            default:
                return <ClearEffect />;
        }
    };

    const getBgTint = () => {
        const main = weatherMain?.toLowerCase();
        if (temperature !== undefined && temperature <= 0 && !['rain', 'drizzle', 'thunderstorm', 'snow'].includes(main || '')) {
            return getBackgroundTint('snow');
        }
        return getBackgroundTint(main);
    };

    return (
        <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none transition-all duration-1000"
            style={{
                background: getBgTint(),
                backdropFilter: 'blur(6px)'
            }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={(temperature !== undefined && temperature <= 0) ? 'freezing' : (weatherMain || 'default')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {renderEffect()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function getBackgroundTint(weather?: string) {
    if (!weather) return 'rgba(0, 0, 0, 0.1)'; // Default slight dark tint

    switch (weather) {
        case 'rain':
        case 'drizzle':
            return 'linear-gradient(to bottom, rgba(43, 50, 178, 0.4), rgba(20, 136, 204, 0.4))';
        case 'snow':
            return 'linear-gradient(to bottom, rgba(189, 195, 199, 0.3), rgba(44, 62, 80, 0.5))';
        case 'clouds':
        case 'mist':
        case 'haze':
        case 'fog':
        case 'smoke':
        case 'dust':
        case 'sand':
        case 'ash':
            return 'linear-gradient(to bottom, rgba(142, 158, 171, 0.4), rgba(238, 242, 243, 0.2))';
        case 'thunderstorm':
        case 'squall':
        case 'tornado':
            return 'linear-gradient(to bottom, rgba(20, 30, 48, 0.7), rgba(36, 59, 85, 0.7))';
        case 'clear':
        default:
            return 'linear-gradient(to bottom, rgba(41, 128, 185, 0.2), rgba(109, 213, 250, 0.2))';
    }
}


