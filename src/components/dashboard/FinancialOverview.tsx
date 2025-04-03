
import React from 'react';
import { ArrowDown, ArrowUp, DollarSign, Users, ShoppingCart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, delay = 0 }) => {
  const isPositive = change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.42, 0, 0.58, 1]
      }}
    >
      <Card>
        <CardHeader className="pb-2 flex justify-between items-start">
          <CardTitle className="text-base text-muted-foreground font-medium">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-sage-lightGray">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center mt-1">
            <div className={cn(
              "flex items-center text-xs font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FinancialOverview: React.FC = () => {
  const stats = [
    { 
      title: "Total Cash Flow", 
      value: "R24,378.00", 
      change: 12.5,
      icon: <DollarSign size={16} className="text-sage-blue" />
    },
    { 
      title: "Accounts Receivable", 
      value: "R18,897.00", 
      change: -2.3,
      icon: <Users size={16} className="text-sage-blue" />
    },
    { 
      title: "Accounts Payable", 
      value: "R8,234.00", 
      change: 4.7,
      icon: <ShoppingCart size={16} className="text-sage-blue" />
    },
    { 
      title: "Bank Balance", 
      value: "R32,567.00", 
      change: 8.2,
      icon: <CreditCard size={16} className="text-sage-blue" />
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          delay={index}
        />
      ))}
    </div>
  );
};

export default FinancialOverview;
