create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists threads_created_at_idx
on public.threads (created_at desc);

create index if not exists threads_author_id_idx
on public.threads (author_id);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  helpful_count integer not null default 0 check (helpful_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists replies_thread_id_created_at_idx
on public.replies (thread_id, created_at asc);

create table if not exists public.reply_helpful_votes (
  reply_id uuid not null references public.replies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at
before update on public.threads
for each row execute function public.set_updated_at();

drop trigger if exists replies_set_updated_at on public.replies;
create trigger replies_set_updated_at
before update on public.replies
for each row execute function public.set_updated_at();

create or replace function public.mark_reply_helpful(p_reply_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_inserted integer;
  v_helpful_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.reply_helpful_votes (reply_id, user_id)
  values (p_reply_id, v_user_id)
  on conflict do nothing;

  get diagnostics v_inserted = row_count;

  if v_inserted = 1 then
    update public.replies
    set helpful_count = helpful_count + 1
    where id = p_reply_id
    returning helpful_count into v_helpful_count;
  else
    select helpful_count
    into v_helpful_count
    from public.replies
    where id = p_reply_id;
  end if;

  if v_helpful_count is null then
    raise exception 'Reply not found';
  end if;

  return v_helpful_count;
end;
$$;

grant execute on function public.mark_reply_helpful(uuid) to authenticated;
