-- ════════════════════════════════════════
-- Migration 001: Initial Schema
-- Online Coaching Platform
-- ════════════════════════════════════════

-- CORE AUTH
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CLIENT PROFILES
CREATE TABLE IF NOT EXISTS clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  age               INT,
  height_cm         NUMERIC(5,1),
  current_weight_kg NUMERIC(5,2),
  experience_level  TEXT CHECK (experience_level IN ('beginner','intermediate','advanced')),
  goal              TEXT CHECK (goal IN ('fat_loss','muscle_gain','recomposition','athletic')),
  health_notes      TEXT,
  start_date        DATE,
  target_date       DATE,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- EXERCISE LIBRARY
CREATE TABLE IF NOT EXISTS exercise_library (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  name_ar       TEXT,
  muscle_group  TEXT NOT NULL,
  equipment     TEXT,
  instructions  TEXT,
  video_url     TEXT,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exercise_library_muscle ON exercise_library(muscle_group);

-- WORKOUT PLANS
CREATE TABLE IF NOT EXISTS workout_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workout_plans_client ON workout_plans(client_id);

CREATE TABLE IF NOT EXISTS workout_days (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_number  INT NOT NULL,
  day_name    TEXT NOT NULL,
  day_name_ar TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_workout_days_plan ON workout_days(plan_id);

CREATE TABLE IF NOT EXISTS exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id          UUID NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
  library_id      UUID REFERENCES exercise_library(id),
  name            TEXT NOT NULL,
  sets            INT NOT NULL,
  reps            TEXT NOT NULL,
  rest_seconds    INT NOT NULL DEFAULT 90,
  notes           TEXT,
  coach_highlight TEXT,
  video_url       TEXT,
  sort_order      INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_exercises_day ON exercises(day_id);

-- PLAN TEMPLATES
CREATE TABLE IF NOT EXISTS plan_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  UUID NOT NULL REFERENCES users(id),
  plan_json   JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WORKOUT LOGS
CREATE TABLE IF NOT EXISTS workout_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  exercise_id   UUID NOT NULL REFERENCES exercises(id),
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  set_number    INT NOT NULL,
  weight_kg     NUMERIC(6,2),
  reps_done     INT,
  completed     BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_workout_logs_client_date ON workout_logs(client_id, logged_at DESC);

-- NUTRITION PLANS
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  mode            TEXT NOT NULL CHECK (mode IN ('fixed', 'flexible')),
  calories_target INT,
  protein_g       NUMERIC(6,1),
  carbs_g         NUMERIC(6,1),
  fat_g           NUMERIC(6,1),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_client ON nutrition_plans(client_id);

-- MEALS
CREATE TABLE IF NOT EXISTS meals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES nutrition_plans(id) ON DELETE CASCADE,
  meal_type   TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  food_items  JSONB NOT NULL
);

-- FOOD DATABASE
CREATE TABLE IF NOT EXISTS food_database (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  name_ar            TEXT,
  brand              TEXT,
  barcode            TEXT UNIQUE,
  calories_per_100g  NUMERIC(7,2) NOT NULL,
  protein_per_100g   NUMERIC(6,2) NOT NULL,
  carbs_per_100g     NUMERIC(6,2) NOT NULL,
  fat_per_100g       NUMERIC(6,2) NOT NULL,
  is_verified        BOOLEAN NOT NULL DEFAULT false,
  created_by         UUID REFERENCES users(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_food_name ON food_database USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_food_barcode ON food_database(barcode);

-- FOOD LOG
CREATE TABLE IF NOT EXISTS food_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  food_id             UUID REFERENCES food_database(id),
  logged_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_type           TEXT,
  weight_grams        NUMERIC(7,2) NOT NULL,
  calculated_calories NUMERIC(7,2) NOT NULL,
  calculated_protein  NUMERIC(6,2) NOT NULL,
  calculated_carbs    NUMERIC(6,2) NOT NULL,
  calculated_fat      NUMERIC(6,2) NOT NULL,
  custom_food_name    TEXT
);
CREATE INDEX IF NOT EXISTS idx_food_log_client_date ON food_log(client_id, logged_at DESC);

-- WEIGHT LOG (TimescaleDB hypertable — skip if extension not available)
CREATE TABLE IF NOT EXISTS weight_log (
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  weight_kg   NUMERIC(5,2) NOT NULL,
  notes       TEXT
);
CREATE INDEX IF NOT EXISTS idx_weight_log_client ON weight_log(client_id, logged_at DESC);

-- BODY MEASUREMENTS
CREATE TABLE IF NOT EXISTS body_measurements (
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  measured_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  weight_kg         NUMERIC(5,2),
  waist_cm          NUMERIC(5,1),
  chest_cm          NUMERIC(5,1),
  shoulders_cm      NUMERIC(5,1),
  hips_cm           NUMERIC(5,1),
  left_arm_cm       NUMERIC(5,1),
  right_arm_cm      NUMERIC(5,1),
  left_thigh_cm     NUMERIC(5,1),
  right_thigh_cm    NUMERIC(5,1),
  body_fat_percent  NUMERIC(4,1),
  notes             TEXT
);
CREATE INDEX IF NOT EXISTS idx_measurements_client ON body_measurements(client_id, measured_at DESC);

-- PROGRESS PHOTOS
CREATE TABLE IF NOT EXISTS progress_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  photo_url   TEXT NOT NULL,
  public_id   TEXT NOT NULL,
  taken_at    DATE NOT NULL,
  pose        TEXT,
  note        TEXT,
  show_on_landing BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_photos_client_date ON progress_photos(client_id, taken_at DESC);

-- DAILY CHECK-IN
CREATE TABLE IF NOT EXISTS daily_checkin (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  checkin_date        DATE NOT NULL,
  workout_status      TEXT CHECK (workout_status IN ('completed','partial','skipped')),
  workout_sets_done   INT,
  diet_compliance     INT CHECK (diet_compliance BETWEEN 0 AND 100),
  cardio_done         BOOLEAN,
  cardio_minutes      INT,
  sleep_quality       INT CHECK (sleep_quality BETWEEN 1 AND 5),
  sleep_hours         NUMERIC(3,1),
  water_intake_cups   INT,
  client_note         TEXT,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, checkin_date)
);
CREATE INDEX IF NOT EXISTS idx_checkin_client_date ON daily_checkin(client_id, checkin_date DESC);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id  UUID NOT NULL REFERENCES users(id),
  to_user_id    UUID NOT NULL REFERENCES users(id),
  content       TEXT NOT NULL,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(from_user_id, to_user_id, created_at DESC);

-- SITE CONTENT (CMS)
CREATE TABLE IF NOT EXISTS site_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key   TEXT UNIQUE NOT NULL,
  content_json  JSONB NOT NULL,
  updated_by    UUID REFERENCES users(id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key   TEXT NOT NULL,
  content_json  JSONB NOT NULL,
  saved_by      UUID REFERENCES users(id),
  saved_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  action        TEXT NOT NULL,
  target_type   TEXT,
  target_id     UUID,
  metadata      JSONB,
  ip_address    INET,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
