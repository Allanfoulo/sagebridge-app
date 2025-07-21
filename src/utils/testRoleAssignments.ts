import { supabase } from '@/integrations/supabase/client';
import { checkRoleAssignments, createDefaultRoles, assignDefaultRole } from './checkRoleAssignments';

/**
 * Test script to check and verify role assignments in the database
 */
export async function testRoleAssignments() {
  console.log('🔍 Testing Role Assignments...');
  
  try {
    // 1. Check current state
    console.log('\n1. Checking current role assignments...');
    await checkRoleAssignments();
    
    // 2. Ensure default roles exist
    console.log('\n2. Creating default roles if they don\'t exist...');
    await createDefaultRoles();
    
    // 3. Check roles again
    console.log('\n3. Checking roles after creation...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    } else {
      console.log('Available roles:', roles);
    }
    
    // 4. Check if current user has any role assignments
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('\n4. Checking current user role assignments...');
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_role_assignments')
        .select(`
          *,
          user_roles!user_role_assignments_role_id_fkey(
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id);
      
      if (userRolesError) {
        console.error('Error fetching user roles:', userRolesError);
      } else {
        console.log('Current user roles:', userRoles);
        
        // If no roles assigned, assign default
        if (userRoles.length === 0) {
          console.log('\n5. No roles found for current user, assigning default role...');
          await assignDefaultRole(user.id, 'User');
          console.log('Default role assigned successfully!');
        }
      }
    } else {
      console.log('\n4. No authenticated user found');
    }
    
    console.log('\n✅ Role assignment test completed!');
    
  } catch (error) {
    console.error('❌ Error during role assignment test:', error);
  }
}

// Export for use in browser console
(window as any).testRoleAssignments = testRoleAssignments;