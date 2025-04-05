import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Filter, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const creditNotes = [
  { id: 'CN-2023-001', supplier: 'Tech Solutions Inc.', date: '2023-06-15', amount: 324.99, reason: 'Damaged Goods', status: 'Applied', invoice: 'INV-2023-001' },
  { id: 'CN-2023-002', supplier: 'Office Supplies Co.', date: '2023-06-18', amount: 87.50, reason: 'Overcharge', status: 'Pending', invoice: 'INV-2023-002' },
  { id: 'CN-2023-003', supplier: 'Furniture Depot', date: '2023-07-01', amount: 745.00, reason: 'Returned Items', status: 'Applied', invoice: 'INV-2023-003' },
  { id: 'CN-2023-004', supplier: 'Electronics Warehouse', date: '2023-07-05', amount: 456.78, reason: 'Incorrect Order', status: 'Pending', invoice: 'INV-2023-004' },
  { id: 'CN-2023-005', supplier: 'Industrial Parts Ltd.', date: '2023-07-10', amount: 1289.99, reason: 'Quality Issues', status: 'Approved', invoice: 'INV-2023-005' },
  { id: 'CN-2023-006', supplier: 'Building Materials Inc.', date: '2023-07-15', amount: 543.21, reason: 'Price Adjustment', status: 'Applied', invoice: 'INV-2023-006' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Applied':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'Approved':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const CreditNotes = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
        onClick={() => navigate('/suppliers')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Suppliers
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Credit Notes</h1>
          <p className="text-muted-foreground">Manage supplier credit notes and refunds</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Credit Note
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,447.47</div>
            <p className="text-xs text-muted-foreground">From 6 credit notes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,613.20</div>
            <p className="text-xs text-muted-foreground">3 notes applied to invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,834.27</div>
            <p className="text-xs text-muted-foreground">3 notes pending application</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Credit Note Status */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Credit Notes</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Filters</CardTitle>
              <CardDescription>Filter and search credit notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="grid w-full md:max-w-sm items-center gap-1.5">
                  <Input type="text" placeholder="Search credit notes..." />
                </div>
                <div className="grid w-full md:max-w-sm items-center gap-1.5">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      <SelectItem value="tech-solutions">Tech Solutions Inc.</SelectItem>
                      <SelectItem value="office-supplies">Office Supplies Co.</SelectItem>
                      <SelectItem value="furniture-depot">Furniture Depot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Credit Notes Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">Credit Notes</CardTitle>
                  <CardDescription>Showing {creditNotes.length} credit notes</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Credit Note #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Applied To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditNotes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.id}</TableCell>
                        <TableCell>{note.supplier}</TableCell>
                        <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                        <TableCell>{note.invoice}</TableCell>
                        <TableCell>{note.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(note.status)}>
                            {note.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${note.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents for Pending, Applied, and Approved */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Credit Notes</CardTitle>
              <CardDescription>Credit notes awaiting approval or application</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Credit Note #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNotes
                    .filter(note => note.status === 'Pending')
                    .map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.id}</TableCell>
                        <TableCell>{note.supplier}</TableCell>
                        <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                        <TableCell>{note.reason}</TableCell>
                        <TableCell className="text-right">${note.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applied Credit Notes</CardTitle>
              <CardDescription>Credit notes that have been applied to invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Credit Note #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Applied To</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNotes
                    .filter(note => note.status === 'Applied')
                    .map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.id}</TableCell>
                        <TableCell>{note.supplier}</TableCell>
                        <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                        <TableCell>{note.invoice}</TableCell>
                        <TableCell>{note.reason}</TableCell>
                        <TableCell className="text-right">${note.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Credit Notes</CardTitle>
              <CardDescription>Credit notes that have been approved but not yet applied</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Credit Note #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNotes
                    .filter(note => note.status === 'Approved')
                    .map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium">{note.id}</TableCell>
                        <TableCell>{note.supplier}</TableCell>
                        <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                        <TableCell>{note.reason}</TableCell>
                        <TableCell className="text-right">${note.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Apply</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CreditNotes;
