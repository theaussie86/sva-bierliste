-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create Teams table
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.teams enable row level security;

create policy "Teams are viewable by everyone." on public.teams for select using (true);
create policy "Authenticated users can create teams." on public.teams for insert with check (auth.role() = 'authenticated');

-- Team Members
create type public.app_role as enum ('member', 'manager', 'admin');
create table public.team_members (
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role app_role default 'member'::app_role not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (team_id, user_id)
);
alter table public.team_members enable row level security;
create policy "Team members viewable by members" on public.team_members for select using (true);

-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  name text not null,
  image_url text,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.products enable row level security;
create policy "Products viewable by everyone" on public.products for select using (true);

-- Product Prices (History)
create table public.product_prices (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade not null,
  price numeric not null,
  valid_from timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.product_prices enable row level security;
create policy "Prices viewable by everyone" on public.product_prices for select using (true);

-- Transactions
create type public.transaction_type as enum ('purchase', 'payment');
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  team_id uuid references public.teams on delete cascade not null,
  product_price_id uuid references public.product_prices,
  payment_amount numeric,
  type public.transaction_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.transactions enable row level security;
create policy "Users manage own transactions" on public.transactions using (auth.uid() = user_id);
