import type { ReactNode } from 'react';
import { CloudRain } from 'lucide-react';
import Footer from './Footer';

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
                    <p className="text-sm font-medium text-slate-500 hidden sm:block">AI Engineer Intern Assessment</p>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    );
}
