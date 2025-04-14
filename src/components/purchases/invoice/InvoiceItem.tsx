
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface InvoiceItemType {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InvoiceItemProps {
  item: InvoiceItemType;
  onItemChange: (id: string, field: keyof InvoiceItemType, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ item, onItemChange, onRemoveItem }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-5">
        <Input 
          placeholder="Item description" 
          value={item.description}
          onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number" 
          min="1"
          value={item.quantity}
          onChange={(e) => onItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number" 
          min="0" 
          step="0.01"
          value={item.unit_price}
          onChange={(e) => onItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-2">
        <Input 
          value={item.total_price.toFixed(2)}
          readOnly 
          className="bg-gray-50"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItem;
