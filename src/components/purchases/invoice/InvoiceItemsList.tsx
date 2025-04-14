
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import InvoiceItem, { InvoiceItemType } from './InvoiceItem';

interface InvoiceItemsListProps {
  items: InvoiceItemType[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes: string;
  onItemChange: (id: string, field: keyof InvoiceItemType, value: string | number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  onNotesChange: (value: string) => void;
}

const InvoiceItemsList: React.FC<InvoiceItemsListProps> = ({
  items,
  subtotal,
  taxAmount,
  totalAmount,
  notes,
  onItemChange,
  onRemoveItem,
  onAddItem,
  onNotesChange
}) => {
  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              {items.map((item) => (
                <InvoiceItem
                  key={item.id}
                  item={item}
                  onItemChange={onItemChange}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (15%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Enter any additional notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceItemsList;
