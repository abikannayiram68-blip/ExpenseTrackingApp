-- ============================================================
-- ExpenseTracker - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expense_tracker;

-- ─── Users ────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  avatar        VARCHAR(500)  NULL,
  currency      CHAR(3)       NOT NULL DEFAULT 'INR',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ─── Password Reset Tokens ────────────────────────────────────────────────────

CREATE TABLE password_reset_tokens (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token      VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  used_at    TIMESTAMP    NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
);

-- ─── Refresh Tokens ───────────────────────────────────────────────────────────

CREATE TABLE refresh_tokens (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token      VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  revoked_at TIMESTAMP    NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Categories ───────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NULL,         -- NULL = global default category
  name       VARCHAR(100) NOT NULL,
  icon       VARCHAR(80)  NOT NULL DEFAULT 'dots-horizontal-circle',
  color      CHAR(7)      NOT NULL DEFAULT '#6C63FF',
  type       ENUM('expense','income','both') NOT NULL DEFAULT 'expense',
  is_default TINYINT(1)   NOT NULL DEFAULT 0,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_type (user_id, type)
);

-- ─── Expenses ─────────────────────────────────────────────────────────────────

CREATE TABLE expenses (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED    NOT NULL,
  category_id    INT UNSIGNED    NULL,
  amount         DECIMAL(15,2)   NOT NULL,
  description    VARCHAR(255)    NOT NULL,
  date           DATE            NOT NULL,
  payment_method ENUM('cash','card','upi','bank_transfer','other') NOT NULL DEFAULT 'cash',
  notes          TEXT            NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_user_date (user_id, date),
  INDEX idx_user_category (user_id, category_id)
);

-- ─── Income ───────────────────────────────────────────────────────────────────

CREATE TABLE income (
  id         INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED  NOT NULL,
  amount     DECIMAL(15,2) NOT NULL,
  source     VARCHAR(150)  NOT NULL,
  date       DATE          NOT NULL,
  notes      TEXT          NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, date)
);

-- ─── Budgets ──────────────────────────────────────────────────────────────────

CREATE TABLE budgets (
  id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED  NOT NULL,
  category_id INT UNSIGNED  NULL,         -- NULL = overall monthly budget
  amount      DECIMAL(15,2) NOT NULL,
  month       TINYINT       NOT NULL,     -- 1-12
  year        SMALLINT      NOT NULL,
  alert_at    TINYINT       NOT NULL DEFAULT 80,  -- alert percentage
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY uk_budget (user_id, category_id, month, year),
  INDEX idx_user_month (user_id, month, year)
);

-- ─── Default Categories Seed ──────────────────────────────────────────────────

INSERT INTO categories (user_id, name, icon, color, type, is_default) VALUES
  (NULL, 'Food & Dining',    'food',                    '#FF6B8A', 'expense', 1),
  (NULL, 'Travel',           'airplane',                '#0095FF', 'expense', 1),
  (NULL, 'Shopping',         'shopping',                '#A78BFA', 'expense', 1),
  (NULL, 'Bills & Utilities','lightning-bolt',          '#FFAB2E', 'expense', 1),
  (NULL, 'Medical',          'hospital-box',            '#00C48C', 'expense', 1),
  (NULL, 'Entertainment',    'gamepad-variant',         '#6C63FF', 'expense', 1),
  (NULL, 'Education',        'school',                  '#00D4AA', 'expense', 1),
  (NULL, 'Salary',           'cash',                    '#00C48C', 'income',  1),
  (NULL, 'Freelance',        'laptop',                  '#0095FF', 'income',  1),
  (NULL, 'Investment',       'chart-line',              '#6C63FF', 'income',  1),
  (NULL, 'Other',            'dots-horizontal-circle',  '#9CA3AF', 'both',    1);
