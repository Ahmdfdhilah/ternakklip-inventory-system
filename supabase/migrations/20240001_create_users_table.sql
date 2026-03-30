create table if not exists public.users (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null default '',
  email       text,
  avatar_path text,
  role        text        not null default 'user'
                          check (role in ('super_admin', 'admin', 'user')),
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

alter table public.users enable row level security;

create policy "authenticated_read_users"
  on public.users for select
  to authenticated
  using (true);
  
create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (id = auth.uid());

create policy "admin_update_users"
  on public.users for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

create policy "superadmin_delete_users"
  on public.users for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role = 'super_admin'
    )
  );

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();