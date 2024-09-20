import { AuthError } from '@/app/components/error/AuthError';
import { Box } from '@chakra-ui/react';
import { Suspense } from 'react';

const Page = () => {
  
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <AuthError/>
    </Suspense>
  );
}

export default Page;