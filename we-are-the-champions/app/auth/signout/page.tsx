"use client"


import { signOut } from 'next-auth/react';
import { Button, Heading, VStack, Text } from '@chakra-ui/react';

const  Page = () => {
  return (
    <VStack spacing={4} align="center" justify="center" minH="100vh">
      <Heading>Sign Out</Heading>
      <Text>Are you sure you want to sign out?</Text>
      <Button colorScheme="red" onClick={() => signOut({ callbackUrl: '/' })}>
        Sign out
      </Button>
    </VStack>
  );
}

export default Page;