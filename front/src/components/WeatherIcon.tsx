import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudFog } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    main: string;
    className?: string;
}

export default function WeatherIcon({ main, className = "w-12 h-12" }: Props) {
    switch (main?.toLowerCase()) {
        case 'clear':
            return (
                <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className={`text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,1)] ${className}`}
                >
                    <Sun className="w-full h-full" />
                </motion.div>
            );
        case 'rain':
        case 'drizzle':
            return (
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`text-blue-400 drop-shadow-[0_0_25px_rgba(96,165,250,1)] ${className}`}
                >
                    <CloudRain className="w-full h-full" />
                </motion.div>
            );
        case 'snow':
            return (
                <motion.div
                    animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className={`text-white drop-shadow-[0_0_25px_rgba(255,255,255,1)] ${className}`}
                >
                    <Snowflake className="w-full h-full" />
                </motion.div>
            );
        case 'thunderstorm':
        case 'squall':
        case 'tornado':
            return (
                <motion.div
                    animate={{ opacity: [1, 0.4, 1, 1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className={`text-indigo-400 drop-shadow-[0_0_30px_rgba(129,140,248,1)] ${className}`}
                >
                    <CloudLightning className="w-full h-full" />
                </motion.div>
            );
        case 'mist':
        case 'fog':
        case 'haze':
        case 'smoke':
        case 'dust':
        case 'sand':
        case 'ash':
            return (
                <motion.div
                    animate={{ x: [-4, 4, -4], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`text-slate-300 drop-shadow-[0_0_25px_rgba(203,213,225,1)] ${className}`}
                >
                    <CloudFog className="w-full h-full" />
                </motion.div>
            );
        case 'clouds':
        default:
            return (
                <motion.div
                    animate={{ scale: [1, 1.04, 1], y: [-2, 2, -2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`text-white drop-shadow-[0_0_30px_rgba(255,255,255,1)] ${className}`}
                >
                    <Cloud className="w-full h-full" />
                </motion.div>
            );
    }
}
