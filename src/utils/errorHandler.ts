import type { AuthError, PostgrestError } from '@supabase/supabase-js';

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export interface ErrorHandlerOptions {
  customMessage?: string;
  silent?: boolean;
}

type SupabaseError = AuthError | PostgrestError;

const isSupabaseError = (error: unknown): error is SupabaseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  );
};

const getStatusMessage = (status: number): string => {
  switch (status) {
    case 400: return 'Permintaan tidak valid. Periksa input Anda.';
    case 401: return 'Sesi berakhir. Silakan login kembali.';
    case 403: return 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.';
    case 404: return 'Data tidak ditemukan.';
    case 422: return 'Validasi gagal. Periksa input Anda.';
    case 429: return 'Terlalu banyak permintaan. Coba lagi nanti.';
    case 500: return 'Terjadi kesalahan server. Coba lagi nanti.';
    case 502: return 'Layanan tidak tersedia sementara. Coba lagi nanti.';
    case 503: return 'Layanan tidak tersedia. Coba lagi nanti.';
    default:  return 'Terjadi kesalahan yang tidak terduga. Coba lagi.';
  }
};

export class ApiErrorHandler {
  public static handle(error: unknown, options: ErrorHandlerOptions = {}): ApiError {
    const { customMessage, silent = false } = options;

    if (!error) return { status: 0, message: 'Terjadi kesalahan yang tidak diketahui' };

    let apiError: ApiError;

    if (isSupabaseError(error)) {
      const status = ('status' in error && typeof error.status === 'number') ? error.status : 0;
      const message = customMessage || error.message || getStatusMessage(status);
      apiError = { status, message, details: error };
    } else if (error instanceof Error) {
      apiError = { status: 0, message: customMessage || error.message || 'Terjadi kesalahan yang tidak terduga' };
    } else {
      apiError = { status: 0, message: customMessage || 'Terjadi kesalahan yang tidak terduga' };
    }

    if (!silent) {
      console.error('API Error:', apiError, error);
    }

    return apiError;
  }
}

export const handleApiError = ApiErrorHandler.handle;
