import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full mt-auto py-8 px-4 border-t border-white/20 bg-black/10 backdrop-blur-md text-white/80 relative z-10"
        >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                            <h4 className="font-bold text-white text-sm tracking-wider uppercase">PM Accelerator</h4>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed max-w-md text-white/70">
                        A premier community and program designed to help professionals transition into and accelerate their careers in product management and AI-engineering through hands-on experience and expert mentorship.
                    </p>
                </div>

                <div className="flex-1 md:text-right space-y-2">
                    <h5 className="text-white font-bold text-lg">AI Engineer Intern Assessment</h5>
                    <div className="flex flex-col md:items-end gap-1">
                        <p className="text-white/90 font-medium">Candidate: <span className="text-blue-400">Kayke</span></p>
                        <p className="text-xs text-white/50">{new Date().getFullYear()} • Kayke Queiroz dos Santos</p>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
