-- ============================================================
-- NGARU POU — FULL DATABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── PHASE 2: Content (replaces Airtable) ─────────────────────

CREATE TABLE blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  excerpt         text,
  content         text,
  author          text,
  cover_image_url text,
  category        text CHECK (category IN ('Culture','Education','News','Events','Community')),
  published_date  timestamptz,
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE gallery_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text,
  caption       text,
  type          text NOT NULL CHECK (type IN ('Photo','Video')),
  image_url     text,
  video_url     text,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── PHASE 3: Student Credentials (replaces Redis) ─────────────

CREATE TABLE student_credentials (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username         text NOT NULL UNIQUE,
  pin_hash         text NOT NULL,
  parent_member_id text NOT NULL,
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  level            text NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── PHASE 5: Messaging (replaces Firebase) ────────────────────

CREATE TABLE rooms (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  members         text[] NOT NULL DEFAULT '{}',
  last_message    text,
  last_message_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id   text NOT NULL,
  sender_name text NOT NULL,
  text        text,
  image_url   text,
  file_url    text,
  file_name   text,
  file_type   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_room_id_idx ON messages(room_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

CREATE TABLE push_subscriptions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text NOT NULL UNIQUE,
  subscription jsonb NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── PHASE 7: Auth Profiles (replaces MemberStack) ─────────────

CREATE TABLE profiles (
  id         uuid PRIMARY KEY, -- matches auth.users.id
  role       text NOT NULL DEFAULT 'parent' CHECK (role IN ('parent','kaiako','admin')),
  first_name text,
  last_name  text,
  email      text,
  phone      text,
  address    text,
  suburb     text,
  state      text,
  postcode   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE student_profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  date_of_birth date,
  level         text NOT NULL,
  username      text NOT NULL UNIQUE,
  medical_notes text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE lesson_progress (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  lesson_id          text NOT NULL,
  level_slug         text NOT NULL,
  week_number        integer NOT NULL,
  completed          boolean NOT NULL DEFAULT false,
  completed_at       timestamptz,
  reflection_answers text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

CREATE INDEX lesson_progress_student_idx ON lesson_progress(student_id);

CREATE TABLE kaiako_questions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid REFERENCES student_profiles(id) ON DELETE SET NULL,
  student_name text NOT NULL,
  level_slug   text NOT NULL,
  week_number  integer NOT NULL,
  question     text NOT NULL,
  answered     boolean NOT NULL DEFAULT false,
  answer       text,
  answered_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── PHASE 8: Payments (Stripe reconnection) ───────────────────

CREATE TABLE subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id     text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan                   text CHECK (plan IN ('1_child','2_children','3_plus')),
  status                 text NOT NULL DEFAULT 'inactive',
  current_period_end     timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ── CURRICULUM (future — replaces Airtable curriculum tables) ──

CREATE TABLE levels (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  age_range     text,
  description   text,
  image_url     text,
  display_order integer NOT NULL DEFAULT 0
);

CREATE TABLE lessons (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id    uuid NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  title       text NOT NULL,
  slug        text NOT NULL,
  week_number integer NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(level_id, week_number)
);

CREATE TABLE lesson_schedule (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id        uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title            text NOT NULL,
  duration_minutes integer,
  display_order    integer NOT NULL DEFAULT 0
);

CREATE TABLE videos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  vimeo_url     text NOT NULL,
  duration      text,
  caption       text,
  display_order integer NOT NULL DEFAULT 0
);

-- ── updated_at triggers ────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
