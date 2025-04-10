
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CustomerFormActionsProps {
  isSubmitting: boolean;
  isEditing?: boolean;
}

const CustomerFormActions = ({ isSubmitting, isEditing = false }: CustomerFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/customers')}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? 'Updating...' : 'Creating...') 
          : (isEditing ? 'Update Customer' : 'Create Customer')}
      </Button>
    </div>
  );
};

export default CustomerFormActions;
