import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { CurrentUser } from './types';

const SELECT_COLS = 'id, name, email, avatar_path, role, is_active';

const profilePromises = new Map<string, Promise<CurrentUser>>();

const authService = {
  async getCurrentUser(authUser: User): Promise<CurrentUser | null> {
    const userId = authUser.id;

    if (profilePromises.has(userId)) {
      return profilePromises.get(userId)!;
    }

    const fetchPromise = (async () => {

      try {
        const dbCall = (async () => {
          return await supabase
            .from('users')
            .select(SELECT_COLS)
            .eq('id', userId)
            .maybeSingle();
        })();

        const timeoutPromise = new Promise<{ data: null; error: any }>((_, reject) =>
          setTimeout(() => reject(new Error('DATABASE_QUERY_TIMEOUT')), 15000)
        );

        const { data, error: selectError } = await (Promise.race([dbCall, timeoutPromise]) as any);

        if (!selectError && data) {
          return data as CurrentUser;
        }

        const upsertCall = (async () => {
          return await supabase
            .from('users')
            .select(SELECT_COLS)
            .single();
        })();

        const { data: upserted, error: upsertError } = await (Promise.race([upsertCall, timeoutPromise]) as any);

        if (!upsertError && upserted) {
          return upserted as CurrentUser;
        }
      } catch (e) {
        console.error('[authService] Profil fetch error:', e);
      } finally {
        profilePromises.delete(userId);
      }

      return null;
    })();

    profilePromises.set(userId, fetchPromise as Promise<CurrentUser>);
    return fetchPromise;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

export { authService };
export default authService;
