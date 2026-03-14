'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  size?: number;
  minHeight?: string;
}

const Loading = ({
  className = "text-[#A8D5BA]",
  size = 40,
  minHeight = "400px"
}: LoadingProps) => {
  return (
    <div className={`w-full flex items-center justify-center`} style={{ minHeight }}>
      <Loader2 className={`animate-spin ${className}`} size={size} />
    </div>
  );
};

export default Loading;
