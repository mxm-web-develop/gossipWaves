import { AlertCircle } from 'lucide-react';

function ErrorComponent({ message }: { message: string }) {
  return (
    <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <AlertCircle className="w-6 h-6 mr-2" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorComponent;