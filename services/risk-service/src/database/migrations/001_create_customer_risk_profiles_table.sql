-- Create customer_risk_profiles table
CREATE TABLE IF NOT EXISTS customer_risk_profiles (
    customer_id VARCHAR(255) PRIMARY KEY,
    credit_score INTEGER NOT NULL CHECK (credit_score >= 300 AND credit_score <= 850),
    monthly_income DECIMAL(10,2) NOT NULL CHECK (monthly_income > 0),
    current_debt DECIMAL(10,2) NOT NULL CHECK (current_debt >= 0),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    max_order_amount DECIMAL(10,2) NOT NULL CHECK (max_order_amount > 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_risk_credit_score ON customer_risk_profiles(credit_score);
CREATE INDEX IF NOT EXISTS idx_customer_risk_risk_level ON customer_risk_profiles(risk_level);
CREATE INDEX IF NOT EXISTS idx_customer_risk_last_updated ON customer_risk_profiles(last_updated);

-- Insert some sample risk profiles for testing
INSERT INTO customer_risk_profiles (
    customer_id, credit_score, monthly_income, current_debt, 
    risk_level, max_order_amount, last_updated
) VALUES 
    ('customer-1', 750, 8000, 2000, 'LOW', 5000, CURRENT_TIMESTAMP),
    ('customer-2', 650, 5000, 1500, 'MEDIUM', 1000, CURRENT_TIMESTAMP),
    ('customer-3', 550, 3000, 2000, 'HIGH', 500, CURRENT_TIMESTAMP),
    ('customer-4', 800, 12000, 1000, 'LOW', 8000, CURRENT_TIMESTAMP),
    ('customer-5', 600, 4000, 3000, 'MEDIUM', 800, CURRENT_TIMESTAMP)
ON CONFLICT (customer_id) DO NOTHING;
