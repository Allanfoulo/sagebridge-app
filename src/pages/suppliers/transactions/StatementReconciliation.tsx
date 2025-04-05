
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Download, Filter, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const reconItems = [
  { id: 1, date: '2023-06-15', reference: 'INV-2023-001', description: 'Server Hardware', amount: 5624.99, matched: true },
  { id: 2, date: '2023-06-18', reference: 'INV-2023-002', description: 'Office Supplies', amount: 1287.50, matched: true },
  { id: 3, date: '2023-07-01', reference: 'PAY-2023-003', description: 'Payment for Furniture', amount: -8745.00, matched: false },
  { id: 4, date: '2023-07-05', reference: 'CN-2023-001', description: 'Credit Note - Damaged Goods', amount: -324.99, matched: false },
  { id: 5, date: '2023-07-10', reference: 'INV-2023-005', description: 'Industrial Parts', amount: 12589.99, matched: true },
  { id: 6, date: '2023-07-15', reference: 'UNKNOWN', description: 'Unknown Transaction', amount: 543.21, matched: false },
];

const suppliers = [
  { id: 1, name: 'Tech Solutions Inc.' },
  { id: 2, name: 'Office Supplies Co.' },
  { id: 3, name: 'Furniture Depot' },
  { id: 4, name: 'Electronics Warehouse' },
  { id: 5, name: 'Industrial Parts Ltd.' },
];

const StatementReconciliation = () => {
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [reconciliationProgress, setReconciliationProgress] = useState<number>(50);

  const matchedItems = reconItems.filter(item => item.matched);
  const unmatchedItems = reconItems.filter(item => !item.matched);

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
          <h1 className="text-2xl font-semibold">Statement Reconciliation</h1>
          <p className="text-muted-foreground">Reconcile supplier statements with your records</p>
        </div>
      </div>

      {/* Select Supplier */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Select Supplier</CardTitle>
          <CardDescription>Choose a supplier to reconcile their statement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="grid w-full md:max-w-md items-center gap-1.5">
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload Statement */}
          {selectedSupplier && (
            <div className="mt-4 space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="statement">Upload Supplier Statement</Label>
                <div className="flex gap-4">
                  <Input id="statement" type="file" />
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reconciliation Progress */}
      {selectedSupplier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Reconciliation Progress</CardTitle>
            <CardDescription>Statement reconciliation is {reconciliationProgress}% complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{reconciliationProgress}% Complete</span>
                <span className="text-sm text-muted-foreground">{matchedItems.length} of {reconItems.length} items matched</span>
              </div>
              <Progress value={reconciliationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reconciliation Detail */}
      {selectedSupplier && (
        <Tabs defaultValue="unmatched">
          <TabsList className="mb-4">
            <TabsTrigger value="unmatched">
              Unmatched Items ({unmatchedItems.length})
            </TabsTrigger>
            <TabsTrigger value="matched">
              Matched Items ({matchedItems.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Items</TabsTrigger>
          </TabsList>

          <TabsContent value="unmatched" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unmatched Items</CardTitle>
                <CardDescription>These items need reconciliation</CardDescription>
              </CardHeader>
              <CardContent>
                {unmatchedItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unmatchedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.reference}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className={`text-right ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(item.amount).toLocaleString()}
                            {item.amount < 0 ? ' CR' : ''}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Match</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Dispute</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p>No unmatched items found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matched" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Matched Items</CardTitle>
                <CardDescription>These items have been successfully reconciled</CardDescription>
              </CardHeader>
              <CardContent>
                {matchedItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.reference}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className={`text-right ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(item.amount).toLocaleString()}
                            {item.amount < 0 ? ' CR' : ''}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-green-100 text-green-800">Matched</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p>No matched items found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Items</CardTitle>
                  <CardDescription>Complete list of reconciliation items</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.reference}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className={`text-right ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(item.amount).toLocaleString()}
                          {item.amount < 0 ? ' CR' : ''}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.matched ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Matched</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Unmatched</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default StatementReconciliation;
