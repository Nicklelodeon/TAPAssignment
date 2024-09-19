"use client"

import { signIn } from 'next-auth/react';
import { Button, Heading, VStack, Text } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  return (
    <VStack spacing={4} align="center" justify="center" minH="100vh">
      <Heading>Sign In</Heading>
      <Text>Choose a provider to sign in with:</Text>
      <Button colorScheme="blue" onClick={() => signIn('google', { callbackUrl})}>
        Sign in with Google
      </Button>
    </VStack>
  );
}

export default Page;