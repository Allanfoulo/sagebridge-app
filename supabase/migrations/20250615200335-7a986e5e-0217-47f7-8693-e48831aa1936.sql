
-- Insert sample suppliers first (if they don't exist)
INSERT INTO suppliers (id, name, email, phone, address, city, state, zip_code, country, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Tech Solutions Inc.', 'contact@techsolutions.com', '555-0101', '123 Tech Street', 'San Francisco', 'CA', '94105', 'USA', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Office Supplies Co.', 'orders@officesupplies.com', '555-0102', '456 Supply Ave', 'Los Angeles', 'CA', '90210', 'USA', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Furniture Depot', 'sales@furnituredepot.com', '555-0103', '789 Furniture Blvd', 'Chicago', 'IL', '60601', 'USA', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Electronics Warehouse', 'info@electronicswarehouse.com', '555-0104', '321 Electronics Way', 'Austin', 'TX', '78701', 'USA', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Industrial Parts Ltd.', 'contact@industrialparts.com', '555-0105', '654 Industrial Dr', 'Detroit', 'MI', '48201', 'USA', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Building Materials Inc.', 'orders@buildingmaterials.com', '555-0106', '987 Construction St', 'Denver', 'CO', '80202', 'USA', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample purchase orders
INSERT INTO purchase_orders (id, supplier_id, order_number, issue_date, status, subtotal, tax_amount, total_amount, notes)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'PO-2023-001', '2023-06-15', 'Completed', 5225.00, 399.99, 5624.99, 'Tech equipment order - completed successfully'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'PO-2023-002', '2023-06-18', 'Pending', 1197.50, 90.00, 1287.50, 'Office supplies - awaiting delivery confirmation'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'PO-2023-003', '2023-06-20', 'Processing', 8125.00, 620.00, 8745.00, 'Office furniture order - currently being processed'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'PO-2023-004', '2023-06-22', 'Completed', 3210.00, 246.78, 3456.78, 'Electronics components - delivered and invoiced'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'PO-2023-005', '2023-06-25', 'Pending', 11695.99, 894.00, 12589.99, 'Industrial parts - large order pending approval'),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'PO-2023-006', '2023-06-28', 'Processing', 6080.00, 463.21, 6543.21, 'Construction materials - order in progress'),
  ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'PO-2023-007', '2023-07-01', 'Completed', 2178.67, 167.00, 2345.67, 'Additional tech supplies - completed'),
  ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'PO-2023-008', '2023-07-05', 'Processing', 814.54, 62.00, 876.54, 'Office supplies replenishment - processing')
ON CONFLICT (id) DO NOTHING;
