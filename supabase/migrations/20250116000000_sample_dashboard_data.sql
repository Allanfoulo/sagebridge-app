-- Sample data for dashboard functionality
-- This migration creates realistic sample data for customers, sales invoices, and bank accounts

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, address, city, state, zip_code, country, is_active)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'billing@acmecorp.com', '555-0201', '100 Business Plaza', 'New York', 'NY', '10001', 'USA', true),
  ('770e8400-e29b-41d4-a716-446655440002', 'Global Enterprises Ltd.', 'accounts@globalent.com', '555-0202', '200 Corporate Center', 'Los Angeles', 'CA', '90210', 'USA', true),
  ('770e8400-e29b-41d4-a716-446655440003', 'TechStart Solutions', 'finance@techstart.com', '555-0203', '300 Innovation Drive', 'Austin', 'TX', '78701', 'USA', true),
  ('770e8400-e29b-41d4-a716-446655440004', 'Manufacturing Plus Inc.', 'billing@mfgplus.com', '555-0204', '400 Industrial Way', 'Detroit', 'MI', '48201', 'USA', true),
  ('770e8400-e29b-41d4-a716-446655440005', 'Retail Solutions Group', 'payments@retailsol.com', '555-0205', '500 Commerce Street', 'Chicago', 'IL', '60601', 'USA', true),
  ('770e8400-e29b-41d4-a716-446655440006', 'Healthcare Systems Co.', 'billing@healthsys.com', '555-0206', '600 Medical Center Dr', 'Miami', 'FL', '33101', 'USA', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bank accounts
INSERT INTO bank_accounts (id, account_name, account_number, bank_name, account_type, current_balance, is_active)
VALUES 
  ('880e8400-e29b-41d4-a716-446655440001', 'Main Business Checking', '****1234', 'First National Bank', 'Checking', 125000.00, true),
  ('880e8400-e29b-41d4-a716-446655440002', 'Business Savings', '****5678', 'First National Bank', 'Savings', 75000.00, true),
  ('880e8400-e29b-41d4-a716-446655440003', 'Payroll Account', '****9012', 'Community Bank', 'Checking', 45000.00, true),
  ('880e8400-e29b-41d4-a716-446655440004', 'Investment Account', '****3456', 'Investment Bank', 'Investment', 200000.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample sales invoices with varied dates and statuses
INSERT INTO sales_invoices (id, customer_id, invoice_number, issue_date, due_date, subtotal, tax_amount, total_amount, status, notes)
VALUES 
  -- Recent invoices (current month)
  ('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', '2024-01-15', '2024-02-14', 15000.00, 1200.00, 16200.00, 'Paid', 'Software development services'),
  ('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', '2024-01-18', '2024-02-17', 8500.00, 680.00, 9180.00, 'Pending', 'Consulting services Q1'),
  ('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'INV-2024-003', '2024-01-20', '2024-02-19', 12000.00, 960.00, 12960.00, 'Paid', 'System integration project'),
  ('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'INV-2024-004', '2024-01-22', '2024-02-21', 25000.00, 2000.00, 27000.00, 'Overdue', 'Manufacturing automation system'),
  ('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'INV-2024-005', '2024-01-25', '2024-02-24', 6500.00, 520.00, 7020.00, 'Pending', 'Retail POS system setup'),
  
  -- Previous month invoices
  ('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', 'INV-2023-012', '2023-12-15', '2024-01-14', 18000.00, 1440.00, 19440.00, 'Paid', 'Healthcare management system'),
  ('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', 'INV-2023-013', '2023-12-20', '2024-01-19', 9500.00, 760.00, 10260.00, 'Paid', 'Additional development work'),
  ('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440002', 'INV-2023-014', '2023-12-22', '2024-01-21', 14000.00, 1120.00, 15120.00, 'Paid', 'Year-end consulting'),
  
  -- Older invoices for historical data
  ('990e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440003', 'INV-2023-011', '2023-11-15', '2023-12-15', 22000.00, 1760.00, 23760.00, 'Paid', 'Q4 system upgrade'),
  ('990e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', 'INV-2023-010', '2023-11-10', '2023-12-10', 16500.00, 1320.00, 17820.00, 'Paid', 'Process optimization'),
  ('990e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440005', 'INV-2023-009', '2023-10-20', '2023-11-19', 11000.00, 880.00, 11880.00, 'Paid', 'Inventory management system'),
  ('990e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440006', 'INV-2023-008', '2023-10-15', '2023-11-14', 19500.00, 1560.00, 21060.00, 'Paid', 'Patient management upgrade')
ON CONFLICT (id) DO NOTHING;

-- Insert sample sales invoice items
INSERT INTO sales_invoice_items (id, sales_invoice_id, description, quantity, unit_price, total_price)
VALUES 
  -- Items for INV-2024-001
  ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'Software Development - Frontend', 80, 150.00, 12000.00),
  ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'Software Development - Backend', 20, 150.00, 3000.00),
  
  -- Items for INV-2024-002
  ('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'Business Consulting', 50, 170.00, 8500.00),
  
  -- Items for INV-2024-003
  ('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'System Integration Services', 60, 200.00, 12000.00),
  
  -- Items for INV-2024-004
  ('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440004', 'Automation System Setup', 100, 250.00, 25000.00),
  
  -- Items for INV-2024-005
  ('aa0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440005', 'POS System Configuration', 26, 250.00, 6500.00)
ON CONFLICT (id) DO NOTHING;

-- Update some recent dates to make data more current
UPDATE sales_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '5 days',
  due_date = CURRENT_DATE + INTERVAL '25 days'
WHERE invoice_number = 'INV-2024-001';

UPDATE sales_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '3 days',
  due_date = CURRENT_DATE + INTERVAL '27 days'
WHERE invoice_number = 'INV-2024-002';

UPDATE sales_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '1 day',
  due_date = CURRENT_DATE + INTERVAL '29 days'
WHERE invoice_number = 'INV-2024-003';

UPDATE sales_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '7 days',
  due_date = CURRENT_DATE - INTERVAL '2 days'  -- This makes it overdue
WHERE invoice_number = 'INV-2024-004';

UPDATE sales_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '2 days',
  due_date = CURRENT_DATE + INTERVAL '28 days'
WHERE invoice_number = 'INV-2024-005';

-- Update supplier invoices to have more recent dates as well
UPDATE supplier_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '4 days',
  due_date = CURRENT_DATE + INTERVAL '26 days'
WHERE invoice_number = 'INV-2023-002';

UPDATE supplier_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '8 days',
  due_date = CURRENT_DATE - INTERVAL '1 day'  -- This makes it overdue
WHERE invoice_number = 'INV-2023-003';

UPDATE supplier_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '6 days',
  due_date = CURRENT_DATE + INTERVAL '24 days'
WHERE invoice_number = 'INV-2023-005';

UPDATE supplier_invoices 
SET 
  issue_date = CURRENT_DATE - INTERVAL '10 days',
  due_date = CURRENT_DATE - INTERVAL '3 days'  -- This makes it overdue
WHERE invoice_number = 'INV-2023-006';