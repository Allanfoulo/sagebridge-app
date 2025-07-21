
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assignDefaultRole, createDefaultRoles } from '@/utils/checkRoleAssignments';

interface UserRole {
  id: string;
  name: string;
  description: string | null;
}

interface UserPermission {
  id: string;
  module: string;
  action: string;
  description: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRoles: UserRole[];
  userPermissions: UserPermission[];
  hasPermission: (module: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const { toast } = useToast();

  // Fetch user roles and permissions
  const fetchUserRolesAndPermissions = async (userId: string) => {
    try {
      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_role_assignments')
        .select(`
          role_id,
          user_roles!user_role_assignments_role_id_fkey(
            id,
            name,
            description
          )
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      // Extract role objects and set them
      const roles = rolesData.map(item => item.user_roles) as UserRole[];
      setUserRoles(roles);

      // Get role IDs for permission lookup
      const roleIds = rolesData.map(item => item.role_id);
      if (roleIds.length === 0) return;

      // Get permissions for these roles
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          perms:permissions!permission_id(
            id,
            module,
            action,
            description
          )
        `)
        .in('role_id', roleIds);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        return;
      }

      // Extract permission objects and set them
      const permissions = permissionsData.map(item => item.perms) as UserPermission[];
      setUserPermissions(permissions);
    } catch (error) {
      console.error('Error in fetchUserRolesAndPermissions:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          if (session?.user) {
            await fetchUserRolesAndPermissions(session.user.id);
          }
          
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        } else if (event === 'SIGNED_OUT') {
          setUserRoles([]);
          setUserPermissions([]);
          
          toast({
            title: "Signed out",
            description: "You have been signed out",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRolesAndPermissions(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Ensure default roles exist
      await createDefaultRoles();
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If user was created successfully, assign default role
      if (data.user) {
        await assignDefaultRole(data.user.id, 'User');
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (module: string, action: string): boolean => {
    return userPermissions.some(
      permission => permission.module === module && permission.action === action
    );
  };

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    return userRoles.some(role => role.name === roleName);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      userRoles, 
      userPermissions,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
