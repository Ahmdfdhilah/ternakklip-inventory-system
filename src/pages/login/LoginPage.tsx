import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import logo from '@/assets/logo/logo.png';
import { TopographyBackground } from '@/components/common/TopographyBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0 text-primary">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
          <TopographyBackground />
        </div>

        <div className="relative z-10 flex items-center gap-3 group cursor-default">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform p-1.5">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white italic">TernakKlip</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1] mt-24">
            Pantau Stok Merchandise <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/50 to-primary animate-gradient">secara real-time.</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
            Solusi ringan berbasis web untuk tim operasional, pantau stok merchandises langsung dari database terpusat.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 0 pt-8 mt-auto">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck size={18} className="text-primary" />
            <span className="text-sm font-medium"> &copy; {new Date().getFullYear()} Ternak Klip. All rights reserved.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-800 shadow-sm">
                <img src={logo} alt="Logo" className="w-full h-full object-contain invert dark:invert-0" />
              </div>
              <span className="text-xl font-extrabold tracking-tight uppercase italic">TernakKlip</span>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Selamat datang kembali</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Masuk ke akun Anda untuk melanjutkan akses dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-input focus:ring-primary focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Kata Sandi</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-input focus:ring-primary focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50 pr-12 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs font-medium text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-70 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                'Masuk ke Akun'
              )}
            </Button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
