export default function AdminLogin() {
    return (
        <div className="admin-theme min-h-screen flex items-center justify-center relative bg-[#060e20] font-body text-on-surface overflow-hidden">
            {/* Background Architectural Elements */}
            <div className="absolute inset-0 opacity-30 z-0 bg-[linear-gradient(to_right,rgba(143,245,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(143,245,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] z-0"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] z-0"></div>

            <main className="relative z-10 w-full max-w-md px-6">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-4 group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500"></div>
                        <img
                            alt="Biznexa CMS Logo"
                            className="relative h-16 w-auto object-contain [filter:drop-shadow(0_0_10px_rgba(0,255,65,0.4))]"
                            src="/lightlogo.svg"
                        />
                    </div>
                    <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface flex items-baseline gap-1">
                        Biznexa <span className="text-primary">CMS</span>
                    </h1>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#a3aac4] mt-1">Digital Solutions Studio</p>
                </div>

                {/* Login Container */}
                <div className="bg-[#192540]/60 backdrop-blur-[20px] border border-[#40485d]/15 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-transparent via-primary/40 to-transparent"></div>
                    
                    <form className="space-y-6">
                        {/* Input Group: Email */}
                        <div className="space-y-2">
                            <label className="font-label text-[11px] uppercase tracking-wider text-primary font-bold ml-1" htmlFor="email">Terminal ID / Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6d758c]">
                                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                                </div>
                                <input className="w-full bg-[#192540] border-none rounded-lg py-3.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-[#6d758c]/50 focus:ring-1 focus:ring-primary/30 transition-all outline-none" id="email" name="email" placeholder="architect@biznexa.studio" type="email" />
                            </div>
                        </div>

                        {/* Input Group: Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="font-label text-[11px] uppercase tracking-wider text-primary font-bold" htmlFor="password">Access Code</label>
                                <a className="font-body text-[11px] text-[#a3aac4] hover:text-secondary transition-colors" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6d758c]">
                                    <span className="material-symbols-outlined text-sm">lock_open</span>
                                </div>
                                <input className="w-full bg-[#192540] border-none rounded-lg py-3.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-[#6d758c]/50 focus:ring-1 focus:ring-primary/30 transition-all outline-none" id="password" name="password" placeholder="••••••••••••" type="password" />
                            </div>
                        </div>

                        {/* Remember Me Toggle */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#192540] cursor-pointer">
                                <input className="sr-only peer" type="checkbox" />
                                <div className="peer h-5 w-9 rounded-full border border-[#40485d]/20 transition-all peer-checked:bg-primary/20"></div>
                                <div className="absolute left-1 h-3 w-3 rounded-full bg-[#6d758c] transition-all peer-checked:translate-x-4 peer-checked:bg-primary"></div>
                            </div>
                            <span className="font-body text-xs text-[#a3aac4]">Maintain active session</span>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-4 bg-[#69f6b8] text-[#00452d] font-headline font-bold text-sm rounded-lg relative group overflow-hidden transition-all active:scale-[0.98]" type="submit">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                Sign In to Console
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </span>
                        </button>
                    </form>

                    {/* Bottom Accents */}
                    <div className="mt-8 pt-6 border-t border-[#40485d]/10 flex flex-col items-center gap-4">
                        <p className="font-body text-[11px] text-[#a3aac4] text-center leading-relaxed">
                            Authorized access only. System activity is monitored under <br/>
                            <span className="text-on-surface font-medium italic opacity-80">Architecture Protocol 7.2</span>
                        </p>
                    </div>
                </div>

                {/* Secondary Navigation/Legal */}
                <footer className="mt-12 flex justify-between items-center text-[10px] font-label uppercase tracking-widest text-[#6d758c]">
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                        <a className="hover:text-primary transition-colors" href="#">Security</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(155,255,206,0.8)]"></span>
                        <span>Systems Nominal</span>
                    </div>
                </footer>
            </main>

            {/* Decorative Corner Brackets */}
            <div className="fixed top-8 left-8 w-12 h-12 border-l border-t border-[#40485d]/20 pointer-events-none"></div>
            <div className="fixed top-8 right-8 w-12 h-12 border-r border-t border-[#40485d]/20 pointer-events-none"></div>
            <div className="fixed bottom-8 left-8 w-12 h-12 border-l border-b border-[#40485d]/20 pointer-events-none"></div>
            <div className="fixed bottom-8 right-8 w-12 h-12 border-r border-b border-[#40485d]/20 pointer-events-none"></div>
        </div>
    );
}
