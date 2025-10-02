/*
  # Los Antojitos de Misha - Initial Schema
  
  ## Overview
  Creates the foundational database structure for the food ordering system.
  
  ## New Tables
  
  ### 1. users_profile
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `phone` (text)
  - `role` (text, default 'cliente')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. categories
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `image_url` (text)
  - `display_order` (integer)
  - `active` (boolean)
  - `created_at` (timestamptz)
  
  ### 3. ingredients
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `unit` (text) - g, ml, pieza
  - `current_stock` (decimal)
  - `minimum_stock` (decimal)
  - `cost_per_unit` (decimal)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. products
  - `id` (uuid, primary key)
  - `category_id` (uuid, references categories)
  - `name` (text)
  - `description` (text)
  - `base_price` (decimal)
  - `image_url` (text)
  - `active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. recipes
  - `id` (uuid, primary key)
  - `product_id` (uuid, references products)
  - `ingredient_id` (uuid, references ingredients)
  - `quantity_needed` (decimal)
  
  ### 6. option_groups
  - `id` (uuid, primary key)
  - `name` (text)
  - `is_required` (boolean)
  - `allow_multiple` (boolean)
  - `display_order` (integer)
  
  ### 7. options
  - `id` (uuid, primary key)
  - `group_id` (uuid, references option_groups)
  - `name` (text)
  - `additional_price` (decimal)
  - `display_order` (integer)
  
  ### 8. product_option_groups
  - `product_id` (uuid, references products)
  - `option_group_id` (uuid, references option_groups)
  
  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to read their own data
  - Add policies for admins to manage all data
  - Public read access for categories, products, option_groups, and options
*/

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  unit text NOT NULL CHECK (unit IN ('g', 'ml', 'pieza')),
  current_stock decimal(10,2) DEFAULT 0,
  minimum_stock decimal(10,2) DEFAULT 0,
  cost_per_unit decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  base_price decimal(10,2) NOT NULL,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create recipes table (product ingredients)
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_needed decimal(10,2) NOT NULL,
  UNIQUE(product_id, ingredient_id)
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create option_groups table
CREATE TABLE IF NOT EXISTS option_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_required boolean DEFAULT false,
  allow_multiple boolean DEFAULT false,
  display_order integer DEFAULT 0
);

ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES option_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  additional_price decimal(10,2) DEFAULT 0,
  display_order integer DEFAULT 0
);

ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- Create product_option_groups junction table
CREATE TABLE IF NOT EXISTS product_option_groups (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  option_group_id uuid REFERENCES option_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, option_group_id)
);

ALTER TABLE product_option_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users_profile
CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users_profile FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for ingredients (admin only)
CREATE POLICY "Admins can view ingredients"
  ON ingredients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage ingredients"
  ON ingredients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for recipes (admin only)
CREATE POLICY "Admins can view recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage recipes"
  ON recipes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for option_groups (public read, admin write)
CREATE POLICY "Anyone can view option groups"
  ON option_groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage option groups"
  ON option_groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for options (public read, admin write)
CREATE POLICY "Anyone can view options"
  ON options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage options"
  ON options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for product_option_groups (public read, admin write)
CREATE POLICY "Anyone can view product option groups"
  ON product_option_groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage product option groups"
  ON product_option_groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_recipes_product ON recipes(product_id);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredient ON recipes(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_options_group ON options(group_id);
CREATE INDEX IF NOT EXISTS idx_users_profile_role ON users_profile(role);