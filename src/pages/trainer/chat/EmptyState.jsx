import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className='flex-1 flex flex-col items-center justify-center bg-gray-50 text-center'>
      <MessageSquare size={64} className='text-gray-300 mb-4' />
      <h3 className='text-xl font-semibold text-gray-600 mb-2'>No trainee selected</h3>
      <p className='text-gray-500'>Select a trainee from the list to start messaging</p>
    </div>
  );
};

export default EmptyState;
