-- Make migration idempotent using DO blocks

-- 1. Create Enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'team_role') THEN
        create type public.team_role as enum ('member', 'manager', 'admin');
    END IF;
END
$$;

-- 2. Add or Alter 'role' column
DO $$
BEGIN
    -- Check if column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'role') THEN
        -- Create column if it doesn't exist
        alter table public.team_members
        add column role public.team_role not null default 'member';
    ELSE
        -- If it exists, ensure it uses the correct type (handling text -> enum conversion)
        -- We temporarily drop the default to alter type safely if needed, then re-apply
        alter table public.team_members
        alter column role drop default;

        alter table public.team_members
        alter column role type public.team_role using role::text::public.team_role;

        alter table public.team_members
        alter column role set default 'member';
    END IF;
END
$$;

-- 3. Add unique constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'team_members_user_id_team_id_key') THEN
        alter table public.team_members
        add constraint team_members_user_id_team_id_key unique (user_id, team_id);
    END IF;
END
$$;
