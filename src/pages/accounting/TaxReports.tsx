
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Calendar, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for tax reports
const taxReports = [
  {
    id: 1,
    name: 'VAT Return - Q1 2023',
    period: 'Jan 1 - Mar 31, 2023',
    dueDate: 'Apr 25, 2023',
    status: 'Submitted',
    submittedDate: 'Apr 20, 2023',
    amount: 8750.25
  },
  {
    id: 2,
    name: 'VAT Return - Q2 2023',
    period: 'Apr 1 - Jun 30, 2023',
    dueDate: 'Jul 25, 2023',
    status: 'Pending',
    submittedDate: '-',
    amount: 9250.75
  },
  {
    id: 3,
    name: 'Employee Tax - March 2023',
    period: 'Mar 1 - Mar 31, 2023',
    dueDate: 'Apr 7, 2023',
    status: 'Submitted',
    submittedDate: 'Apr 5, 2023',
    amount: 12500.00
  },
  {
    id: 4,
    name: 'Employee Tax - April 2023',
    period: 'Apr 1 - Apr 30, 2023',
    dueDate: 'May 7, 2023',
    status: 'Pending',
    submittedDate: '-',
    amount: 12750.00
  },
  {
    id: 5,
    name: 'Provisional Tax - 1st Payment 2023',
    period: 'Mar 1, 2022 - Feb 28, 2023',
    dueDate: 'Aug 31, 2023',
    status: 'Upcoming',
    submittedDate: '-',
    amount: 32500.00
  }
];

const taxLiabilities = [
  {
    id: 1,
    type: 'VAT Payable',
    amount: 9250.75,
    dueDate: 'Jul 25, 2023'
  },
  {
    id: 2,
    type: 'Employee Tax Payable',
    amount: 12750.00,
    dueDate: 'May 7, 2023'
  },
  {
    id: 3,
    type: 'Provisional Tax',
    amount: 32500.00,
    dueDate: 'Aug 31, 2023'
  }
];

const TaxReports = () => {
  const navigate = useNavigate();
  const [yearFilter, setYearFilter] = useState('2023');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter reports based on year and type
  const filteredReports = taxReports.filter(report =>
    report.period.includes(yearFilter) &&
    (typeFilter === 'all' ? true : report.name.toLowerCase().includes(typeFilter.toLowerCase()))
  );

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
          <h1 className="text-2xl font-semibold text-white mb-2">Tax Reports</h1>
          <p className="text-white/80">Prepare, review, and submit your tax reports</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Tax Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxLiabilities.map(liability => (
                  <div key={liability.id} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{liability.type}</p>
                      <p className="text-xs text-muted-foreground">Due: {liability.dueDate}</p>
                    </div>
                    <p className="font-semibold">R{liability.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Due:</span>
                  <span className="font-bold">R54,500.75</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tax Calendar</CardTitle>
              <CardDescription>Upcoming tax return due dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Employee Tax - April 2023</p>
                    <p className="text-xs text-muted-foreground">Due in 5 days (May 7, 2023)</p>
                  </div>
                  <Button size="sm">Prepare</Button>
                </div>
                
                <div className="flex items-center p-3 bg-white border rounded-md">
                  <div className="bg-sage-lightGray p-2 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-sage-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">VAT Return - Q2 2023</p>
                    <p className="text-xs text-muted-foreground">Due on Jul 25, 2023</p>
                  </div>
                  <Button size="sm" variant="outline">Prepare</Button>
                </div>
                
                <div className="flex items-center p-3 bg-white border rounded-md">
                  <div className="bg-sage-lightGray p-2 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-sage-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Provisional Tax - 1st Payment 2023</p>
                    <p className="text-xs text-muted-foreground">Due on Aug 31, 2023</p>
                  </div>
                  <Button size="sm" variant="outline">Prepare</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Alert variant="warning" className="bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Tax Notice</AlertTitle>
          <AlertDescription>
            Ensure all your tax submissions are accurate and submitted on time to avoid penalties.
            Consider consulting with a tax professional for complex tax matters.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tax Returns & Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Tax Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="vat">VAT</SelectItem>
                      <SelectItem value="employee">Employee Tax</SelectItem>
                      <SelectItem value="provisional">Provisional Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{report.dueDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.status === 'Submitted' 
                                ? 'bg-green-100 text-green-800' 
                                : report.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {report.status}
                            </span>
                          </TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>R{report.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              {report.status !== 'Submitted' && (
                                <Button size="sm">
                                  {report.status === 'Pending' ? 'Submit' : 'Prepare'}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    {/* Similar structure as above, but filtered for pending reports */}
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.filter(r => r.status === 'Pending').map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{report.dueDate}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                              {report.status}
                            </span>
                          </TableCell>
                          <TableCell>R{report.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button size="sm">
                                Submit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="submitted">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    {/* Similar structure as above, but filtered for submitted reports */}
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.filter(r => r.status === 'Submitted').map(report => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>R{report.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                              >
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
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

export default TaxReports;
