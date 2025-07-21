import { supabase } from '@/integrations/supabase/client';

// Utility function to check current state of role assignments
export const checkRoleAssignments = async () => {
  try {
    // Check if there are any roles in the system
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return;
    }
    
    console.log('Available roles:', roles);
    
    // Check if there are any role assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from('user_role_assignments')
      .select('*');
    
    if (assignmentsError) {
      console.error('Error fetching role assignments:', assignmentsError);
      return;
    }
    
    console.log('Current role assignments:', assignments);
    
    // Check if there are any permissions
    const { data: permissions, error: permissionsError } = await supabase
      .from('permissions')
      .select('*');
    
    if (permissionsError) {
      console.error('Error fetching permissions:', permissionsError);
      return;
    }
    
    console.log('Available permissions:', permissions);
    
    return {
      roles: roles || [],
      assignments: assignments || [],
      permissions: permissions || []
    };
  } catch (error) {
    console.error('Error in checkRoleAssignments:', error);
  }
};

// Function to create default roles if they don't exist
export const createDefaultRoles = async () => {
  try {
    const defaultRoles = [
      { name: 'Administrator', description: 'Full system access' },
      { name: 'Manager', description: 'Management level access' },
      { name: 'Accountant', description: 'Accounting and financial access' },
      { name: 'User', description: 'Basic user access' }
    ];
    
    for (const role of defaultRoles) {
      const { error } = await supabase
        .from('user_roles')
        .upsert(role, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error creating role ${role.name}:`, error);
      } else {
        console.log(`Role ${role.name} created/updated successfully`);
      }
    }
  } catch (error) {
    console.error('Error creating default roles:', error);
  }
};

// Function to assign default role to a user
export const assignDefaultRole = async (userId: string, roleName: string = 'User') => {
  try {
    // First, get the role ID
    const { data: role, error: roleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('name', roleName)
      .single();
    
    if (roleError || !role) {
      console.error('Error finding role:', roleError);
      return false;
    }
    
    // Check if user already has this role
    const { data: existingAssignment, error: checkError } = await supabase
      .from('user_role_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', role.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing assignment:', checkError);
      return false;
    }
    
    if (existingAssignment) {
      console.log('User already has this role assigned');
      return true;
    }
    
    // Assign the role
    const { error: assignError } = await supabase
      .from('user_role_assignments')
      .insert({
        user_id: userId,
        role_id: role.id
      });
    
    if (assignError) {
      console.error('Error assigning role:', assignError);
      return false;
    }
    
    console.log(`Role ${roleName} assigned to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in assignDefaultRole:', error);
    return false;
  }
};