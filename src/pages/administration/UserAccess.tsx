
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string | null;
}

interface Module {
  name: string;
  permissions: Permission[];
}

const UserAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch roles and permissions
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setLoading(true);
        
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
        
        if (rolesError) {
          throw rolesError;
        }
        
        setRoles(rolesData);
        
        if (rolesData.length > 0 && !selectedRole) {
          setSelectedRole(rolesData[0].id);
        }
        
        // Fetch permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*');
        
        if (permissionsError) {
          throw permissionsError;
        }
        
        // Group permissions by module
        const moduleMap: Record<string, Permission[]> = {};
        permissionsData.forEach((permission) => {
          if (!moduleMap[permission.module]) {
            moduleMap[permission.module] = [];
          }
          moduleMap[permission.module].push(permission);
        });
        
        const modulesArray: Module[] = Object.keys(moduleMap).map(moduleName => ({
          name: moduleName,
          permissions: moduleMap[moduleName]
        }));
        
        setModules(modulesArray);
        
        // Fetch role permissions for each role
        const newRolePermissions: Record<string, string[]> = {};
        
        for (const role of rolesData) {
          const { data: rolePermData, error: rolePermError } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions:permission_id(id, module, action)')
            .eq('role_id', role.id);
          
          if (rolePermError) {
            console.error(`Error fetching permissions for role ${role.name}:`, rolePermError);
            continue;
          }
          
          // Create a unique key for each permission (module_action)
          newRolePermissions[role.id] = rolePermData.map(rp => {
            const perm = rp.permissions as Permission;
            return `${perm.module}_${perm.action}`;
          });
        }
        
        setRolePermissions(newRolePermissions);
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles and permissions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolesAndPermissions();
  }, [toast]);

  const handlePermissionChange = async (permission: Permission, checked: boolean) => {
    if (!selectedRole) return;
    
    const permissionKey = `${permission.module}_${permission.action}`;
    const currentRolePermissions = [...(rolePermissions[selectedRole] || [])];
    
    if (checked && !currentRolePermissions.includes(permissionKey)) {
      currentRolePermissions.push(permissionKey);
    } else if (!checked && currentRolePermissions.includes(permissionKey)) {
      const index = currentRolePermissions.indexOf(permissionKey);
      if (index > -1) {
        currentRolePermissions.splice(index, 1);
      }
    }
    
    setRolePermissions({
      ...rolePermissions,
      [selectedRole]: currentRolePermissions,
    });
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    
    try {
      setSaving(true);
      
      // Get current permissions for this role to determine what to add/remove
      const { data: currentPermissions, error: fetchError } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', selectedRole);
      
      if (fetchError) throw fetchError;
      
      const currentPermissionIds = currentPermissions.map(p => p.permission_id);
      
      // Get all permissions to map keys back to IDs
      const { data: allPermissions, error: allPermError } = await supabase
        .from('permissions')
        .select('id, module, action');
      
      if (allPermError) throw allPermError;
      
      // Create a map of permission keys to permission IDs
      const permissionKeyToId: Record<string, string> = {};
      allPermissions.forEach(p => {
        permissionKeyToId[`${p.module}_${p.action}`] = p.id;
      });
      
      // Determine which permissions to add
      const selectedPermissionKeys = rolePermissions[selectedRole] || [];
      const selectedPermissionIds = selectedPermissionKeys
        .map(key => permissionKeyToId[key])
        .filter(id => id); // Remove undefined values
      
      // Find permissions to add (in selected but not in current)
      const permissionsToAdd = selectedPermissionIds.filter(
        id => !currentPermissionIds.includes(id)
      );
      
      // Find permissions to remove (in current but not in selected)
      const permissionsToRemove = currentPermissionIds.filter(
        id => !selectedPermissionIds.includes(id)
      );
      
      // Perform deletions first
      if (permissionsToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', selectedRole)
          .in('permission_id', permissionsToRemove);
        
        if (deleteError) throw deleteError;
      }
      
      // Then perform additions
      if (permissionsToAdd.length > 0) {
        const newRolePermissions = permissionsToAdd.map(permissionId => ({
          role_id: selectedRole,
          permission_id: permissionId
        }));
        
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(newRolePermissions);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: 'Success',
        description: 'User access settings have been saved successfully',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save permissions',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedRoleName = roles.find(r => r.id === selectedRole)?.name || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/administration')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Administration
        </Button>
      </div>

      {/* Header Section */}
      <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-2">Control User Access</h1>
        <p className="text-white/80">Manage roles and permissions for different user types</p>
      </div>

      {roles.length === 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Roles Found</AlertTitle>
          <AlertDescription>
            No roles are available in the system. Please contact your administrator.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={roles.length === 0}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedRole || saving}
            >
              {saving ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>

          {selectedRole && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">
                Configure permissions for the <strong>{selectedRoleName}</strong> role
              </p>
            </div>
          )}

          {/* Permissions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.name}>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-6">
                      {module.permissions.map((permission) => {
                        const permissionKey = `${permission.module}_${permission.action}`;
                        const isChecked = rolePermissions[selectedRole]?.includes(permissionKey) || false;
                        return (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${permission.module}-${permission.action}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission, checked as boolean)
                              }
                              disabled={!selectedRole}
                            />
                            <Label
                              htmlFor={`${permission.module}-${permission.action}`}
                              className="capitalize"
                            >
                              {permission.action.replace('_', ' ')}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserAccess;
