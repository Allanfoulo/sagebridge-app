
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    database: 'checking',
    auth: 'checking',
    time: new Date().toISOString()
  });

  useEffect(() => {
    const checkSystem = async () => {
      try {
        // Check database connection with a simplified query that doesn't rely on specific tables
        const { data: healthData, error: healthError } = await supabase.rpc('pg_stat_database_size', { dbname: 'postgres' }).maybeSingle();
        
        if (healthError) {
          console.error("Database health check error:", healthError);
          setStatus(prev => ({ ...prev, database: 'error' }));
        } else {
          setStatus(prev => ({ ...prev, database: 'operational' }));
        }
        
        // Check auth service
        const authResponse = await supabase.auth.getSession();
        if (authResponse.error) {
          console.error("Auth check error:", authResponse.error);
          setStatus(prev => ({ ...prev, auth: 'error' }));
        } else {
          setStatus(prev => ({ ...prev, auth: 'operational' }));
        }
      } catch (error) {
        console.error("System check error:", error);
        setStatus({
          database: 'error',
          auth: 'error',
          time: new Date().toISOString()
        });
      }
    };
    
    checkSystem();
    
    // Update time every 30 seconds
    const timer = setInterval(() => {
      setStatus(prev => ({ ...prev, time: new Date().toISOString() }));
      checkSystem(); // Also recheck system status periodically
    }, 30000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Checking...</Badge>;
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Database:</span>
            {getStatusBadge(status.database)}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Authentication:</span>
            {getStatusBadge(status.auth)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(status.time).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
