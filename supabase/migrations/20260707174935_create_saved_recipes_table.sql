/*
# Create saved_recipes table (multi-user, owner-scoped)

1. New Tables
- `saved_recipes`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to the authenticated user, references auth.users with cascade delete)
  - `title` (text, not null) — recipe title
  - `description` (text) — short description
  - `image_url` (text) — optional hero image URL
  - `cuisine` (text) — cuisine type
  - `prep_time_minutes` (integer) — prep time
  - `cook_time_minutes` (integer) — cook time
  - `servings` (integer) — number of servings
  - `ingredients` (jsonb, not null) — array of ingredient strings
  - `essential_ingredients` (jsonb) — array of core ingredients (from vision lookup)
  - `replaceable_ingredients` (jsonb) — array of substitutable ingredients (from vision lookup)
  - `substitutions` (jsonb) — array of {original, substitute} pairs
  - `steps` (jsonb, not null) — array of step strings
  - `macros` (jsonb) — {protein, carbs, fat, calories} nutritional info
  - `source` (text) — 'roulette' or 'reverse_lookup'
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `saved_recipes`.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
- 4 separate policies (select/insert/update/delete) scoped to authenticated users.
*/

CREATE TABLE IF NOT EXISTS saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  cuisine text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  essential_ingredients jsonb DEFAULT '[]'::jsonb,
  replaceable_ingredients jsonb DEFAULT '[]'::jsonb,
  substitutions jsonb DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  macros jsonb,
  source text DEFAULT 'roulette',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recipes" ON saved_recipes;
CREATE POLICY "select_own_recipes" ON saved_recipes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recipes" ON saved_recipes;
CREATE POLICY "insert_own_recipes" ON saved_recipes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recipes" ON saved_recipes;
CREATE POLICY "update_own_recipes" ON saved_recipes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recipes" ON saved_recipes;
CREATE POLICY "delete_own_recipes" ON saved_recipes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_recipes_user_id_idx ON saved_recipes(user_id);
