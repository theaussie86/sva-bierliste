-- Add is_admin column to profiles table
alter table public.profiles
add column is_admin boolean default false;

-- Allow users to read their own is_admin status (assuming RLS is already set up for profiles)
-- If RLS is strictly "users can only see their own profile", this is fine.
-- If RLS allows "users can see everyone's profile" (common for social apps), then everyone can see who is an admin. This is usually acceptable.
