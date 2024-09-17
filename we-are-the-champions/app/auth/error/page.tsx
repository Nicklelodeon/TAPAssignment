import { AuthError } from '@/app/components/error/AuthError';
import { Suspense } from 'react';

const Page = () => {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError/>
    </Suspense>
  );
}

export default Page;