import type { ReactNode } from 'react';
import { CloudRain } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-transparent">
            <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-b border-white/20 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CloudRain className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            SmartWeather
                        </h1>
                    </div>
                    <p className="text-sm font-medium text-slate-500 hidden sm:block">PM Accelerator Intern Assessment</p>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative z-10">
                {children}
            </main>

            <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8 mt-auto relative z-10">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                    <div className="text-center md:text-left max-w-xl">
                        <h4 className="font-bold text-slate-800 text-base mb-1.5">Product Manager Accelerator</h4>
                        <p className="leading-relaxed">A premier community and program designed to help professionals transition into and accelerate their careers in product management and AI-engineering through hands-on experience and expert mentorship.</p>
                    </div>
                    <div className="text-center md:text-right shrink-0">
                        <p className="font-medium text-slate-800">AI Engineer Intern Assessment</p>
                        <p className="mt-1 font-semibold text-blue-600 text-lg">Candidate: Kayke Queiroz dos Santos</p>
                        <a
                            href="https://www.linkedin.com/company/product-manager-accelerator/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
                        >
                            PM Accelerator on LinkedIn ↗
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
