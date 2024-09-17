"use client"
import { useSearchParams } from 'next/navigation';
import { Button, Heading, VStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export const AuthError = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unknown error occurred.';

  if (error === 'AccessDenied') {
    errorMessage = 'You do not have permission to sign in';
  }

  return (
      <VStack spacing={4} align="center" justify="center" minH="100vh">
        <Heading>Authentication Error</Heading>
        <Text>{errorMessage}</Text>
        <Button colorScheme="blue" onClick={() => router.push(process.env.NEXT_PUBLIC_URL!)}>
          Go back to main page
        </Button>
      </VStack>
  );
}

