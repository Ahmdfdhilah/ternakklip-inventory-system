import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground">Akses Ditolak</h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Kembali
          </Button>
          <Button onClick={() => (window.location.href = '/')}>
            Ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
