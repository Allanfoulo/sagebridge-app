
-- Enable realtime for supplier_invoices table (if not already enabled)
ALTER TABLE supplier_invoices REPLICA IDENTITY FULL;

-- Add supplier_invoices to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE supplier_invoices;

-- Insert some sample data to replace the hardcoded invoices
INSERT INTO supplier_invoices (
  supplier_id,
  invoice_number,
  issue_date,
  due_date,
  total_amount,
  status,
  notes
) VALUES 
  -- We'll need to get actual supplier IDs from the suppliers table
  ((SELECT id FROM suppliers WHERE name ILIKE '%tech%' LIMIT 1), 'INV-2023-001', '2023-06-15', '2023-07-15', 5624.99, 'Paid', 'Technology equipment purchase'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%office%' LIMIT 1), 'INV-2023-002', '2023-06-18', '2023-07-18', 1287.50, 'Pending', 'Office supplies order'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%furniture%' LIMIT 1), 'INV-2023-003', '2023-06-20', '2023-07-20', 8745.00, 'Overdue', 'Furniture for office renovation'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%electronics%' LIMIT 1), 'INV-2023-004', '2023-06-22', '2023-07-22', 3456.78, 'Paid', 'Electronic components'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%industrial%' LIMIT 1), 'INV-2023-005', '2023-06-25', '2023-07-25', 12589.99, 'Pending', 'Industrial parts and materials'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%building%' LIMIT 1), 'INV-2023-006', '2023-06-28', '2023-07-28', 6543.21, 'Overdue', 'Building materials'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%tech%' LIMIT 1), 'INV-2023-007', '2023-07-01', '2023-08-01', 2345.67, 'Paid', 'Additional tech equipment'),
  ((SELECT id FROM suppliers WHERE name ILIKE '%office%' LIMIT 1), 'INV-2023-008', '2023-07-05', '2023-08-05', 876.54, 'Pending', 'Monthly office supplies');

-- If no suppliers exist, create some sample suppliers first
INSERT INTO suppliers (name, email, phone, address, is_active)
SELECT * FROM (VALUES
  ('Tech Solutions Inc.', 'contact@techsolutions.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', true),
  ('Office Supplies Co.', 'orders@officesupplies.com', '+1-555-0102', '456 Office Ave, Business District, NY', true),
  ('Furniture Depot', 'sales@furnituredepot.com', '+1-555-0103', '789 Furniture Blvd, Design Quarter, TX', true),
  ('Electronics Warehouse', 'info@electronicswarehouse.com', '+1-555-0104', '321 Electronics Way, Tech Park, WA', true),
  ('Industrial Parts Ltd.', 'contact@industrialparts.com', '+1-555-0105', '654 Industrial Road, Manufacturing Zone, MI', true),
  ('Building Materials Inc.', 'sales@buildingmaterials.com', '+1-555-0106', '987 Construction Ave, Builder District, FL', true)
) AS v(name, email, phone, address, is_active)
WHERE NOT EXISTS (SELECT 1 FROM suppliers LIMIT 1);
