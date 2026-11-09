import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full mt-auto py-8 px-4 border-t border-white/20 bg-black/10 backdrop-blur-md text-white/80 relative z-10"
        >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="text-xl">🌤️</span>
                        <h4 className="font-extrabold text-white text-lg tracking-wide">SmartWeather</h4>
                    </div>
                    <p className="text-sm leading-relaxed max-w-md text-white/70">
                        Full-Stack AI Weather Intelligence Platform with real-time analytics, Google Gemini insights, and interactive mapping.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
                    <p className="text-white/90 font-medium text-sm">
                        Developed with ❤️ by <span className="text-blue-400 font-semibold">Kayke Queiroz dos Santos</span>
                    </p>
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} SmartWeather. All rights reserved.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
