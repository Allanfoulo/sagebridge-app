
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
        // Check database connection
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
          setStatus(prev => ({ ...prev, database: 'error' }));
          console.error("Database check error:", error);
        } else {
          setStatus(prev => ({ ...prev, database: 'operational' }));
        }
        
        // Check auth service
        const authResponse = await supabase.auth.getSession();
        if (authResponse.error) {
          setStatus(prev => ({ ...prev, auth: 'error' }));
          console.error("Auth check error:", authResponse.error);
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
