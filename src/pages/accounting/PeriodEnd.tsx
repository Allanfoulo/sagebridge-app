import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Calendar, 
  RefreshCw, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  FileText,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const periodStatuses = [
  {
    period: 'January 2023',
    status: 'Closed',
    closedDate: 'Feb 05, 2023',
    closedBy: 'John Smith',
    checklist: {
      reconciliations: true,
      journals: true,
      accounts: true,
      taxes: true,
      reports: true
    }
  },
  {
    period: 'February 2023',
    status: 'Closed',
    closedDate: 'Mar 08, 2023',
    closedBy: 'Jane Doe',
    checklist: {
      reconciliations: true,
      journals: true,
      accounts: true,
      taxes: true,
      reports: true
    }
  },
  {
    period: 'March 2023',
    status: 'Closed',
    closedDate: 'Apr 10, 2023',
    closedBy: 'John Smith',
    checklist: {
      reconciliations: true,
      journals: true,
      accounts: true,
      taxes: true,
      reports: true
    }
  },
  {
    period: 'April 2023',
    status: 'In Progress',
    closedDate: '-',
    closedBy: '-',
    checklist: {
      reconciliations: true,
      journals: true,
      accounts: false,
      taxes: true,
      reports: false
    }
  },
  {
    period: 'May 2023',
    status: 'Future',
    closedDate: '-',
    closedBy: '-',
    checklist: {
      reconciliations: false,
      journals: false,
      accounts: false,
      taxes: false,
      reports: false
    }
  },
  {
    period: 'June 2023',
    status: 'Future',
    closedDate: '-',
    closedBy: '-',
    checklist: {
      reconciliations: false,
      journals: false,
      accounts: false,
      taxes: false,
      reports: false
    }
  }
];

const yearEndChecklist = [
  {
    task: 'Review outstanding invoices and bills',
    completed: true,
    critical: true
  },
  {
    task: 'Reconcile all bank accounts',
    completed: true,
    critical: true
  },
  {
    task: 'Post all outstanding journal entries',
    completed: true,
    critical: true
  },
  {
    task: 'Reconcile accounts receivable',
    completed: true,
    critical: true
  },
  {
    task: 'Reconcile accounts payable',
    completed: false,
    critical: true
  },
  {
    task: 'Review fixed asset register',
    completed: false,
    critical: false
  },
  {
    task: 'Calculate and post depreciation',
    completed: false,
    critical: true
  },
  {
    task: 'Review inventory valuation',
    completed: false,
    critical: true
  },
  {
    task: 'Post accruals and prepayments',
    completed: false,
    critical: true
  },
  {
    task: 'Generate preliminary financial statements',
    completed: false,
    critical: true
  },
  {
    task: 'Prepare tax worksheets',
    completed: false,
    critical: true
  },
  {
    task: 'Close revenue and expense accounts to retained earnings',
    completed: false,
    critical: true
  }
];

const PeriodEnd = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  
  const completedTasks = yearEndChecklist.filter(task => task.completed).length;
  const completionPercentage = (completedTasks / yearEndChecklist.length) * 100;
  
  const currentMonth = periodStatuses.find(period => period.status === 'In Progress');
  const checklistValues = currentMonth ? Object.values(currentMonth.checklist) : [];
  const completedChecks = checklistValues.filter(value => value).length;
  const monthCompletionPercentage = currentMonth ? (completedChecks / checklistValues.length) * 100 : 0;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/accounting')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Accounting
          </Button>
        </div>
        
        <div className="bg-sage-blue rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">Period End Processes</h1>
          <p className="text-white/80">Manage month-end and year-end closing procedures</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Period Status</CardTitle>
              <CardDescription>April 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Month-End Progress</span>
                    <span className="text-sm">{completedChecks} of {checklistValues.length} tasks completed</span>
                  </div>
                  <Progress value={monthCompletionPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="border rounded-md p-3 text-center">
                    <div className="mb-2">
                      {currentMonth?.checklist.reconciliations ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs">Reconciliations</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <div className="mb-2">
                      {currentMonth?.checklist.journals ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs">Journals</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <div className="mb-2">
                      {currentMonth?.checklist.accounts ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs">Accounts</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <div className="mb-2">
                      {currentMonth?.checklist.taxes ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs">Taxes</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <div className="mb-2">
                      {currentMonth?.checklist.reports ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs">Reports</p>
                  </div>
                </div>
                
                <Alert className="bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>
                    Complete all required tasks before closing the current period. Missing tasks: Accounts verification, Financial reports generation.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm">
                    <p>Current Period: <span className="font-medium">April 2023</span></p>
                    <p>Financial Year: <span className="font-medium">Jan 2023 - Dec 2023</span></p>
                  </div>
                  
                  <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                      <Button disabled={monthCompletionPercentage < 100}>
                        <Lock className="h-4 w-4 mr-2" />
                        Close Period
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Period Close</DialogTitle>
                        <DialogDescription>
                          You are about to close the accounting period for April 2023. This action cannot be easily reversed. All transactions for this period will be locked.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm font-medium">Make sure you've completed all period-end tasks.</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button onClick={() => setShowDialog(false)}>Confirm Close Period</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Year-End Status</CardTitle>
              <CardDescription>Fiscal Year 2023</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm">{completedTasks} of {yearEndChecklist.length} tasks</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              <div className="text-sm">
                <p>Year Start: <span className="font-medium">January 1, 2023</span></p>
                <p>Year End: <span className="font-medium">December 31, 2023</span></p>
                <p>Days Remaining: <span className="font-medium">241</span></p>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/reports')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Year-to-Date Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Period Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Period</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date Closed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Closed By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {periodStatuses.map((period, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">{period.period}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          period.status === 'Closed' 
                            ? 'bg-green-100 text-green-800' 
                            : period.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {period.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{period.closedDate}</td>
                      <td className="px-4 py-3 text-sm">{period.closedBy}</td>
                      <td className="px-4 py-3 text-sm">
                        {period.status === 'Closed' && (
                          <Button size="sm" variant="outline">
                            View Reports
                          </Button>
                        )}
                        {period.status === 'In Progress' && (
                          <Button size="sm">
                            Continue Tasks
                          </Button>
                        )}
                        {period.status === 'Future' && (
                          <Button size="sm" variant="outline" disabled>
                            Not Available
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Year-End Checklist</CardTitle>
            <CardDescription>Tasks to complete before closing the fiscal year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 space-y-4">
              {yearEndChecklist.map((task, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${task.completed ? 'text-green-600' : 'text-gray-300'}`}>
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    {task.critical && !task.completed && (
                      <p className="text-xs text-amber-600">Required before year-end close</p>
                    )}
                  </div>
                  {!task.completed && (
                    <Button size="sm" variant="outline">Start</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Year-End Planner
            </Button>
            <Button>
              Generate Year-End Reports
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={() => navigate('/reports')}>
            View All Financial Reports
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PeriodEnd;
