"use client";
import React from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  Text,
  Container,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { useSession, signIn, signOut } from "next-auth/react";

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const { data: session, status } = useSession();

  return (
    <Box
      w="100%"
      h="20"
      position="sticky"
      borderBottom="1px"
      borderColor="black"
    >
      <Container maxW="container.xl" h="100%">
        <Flex justify="space-between" align="center" h="100%">
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            <Link href="/">Home</Link>

            <Link href="/teams">View Teams</Link>

            <Link href="/matches">View Recent Matches</Link>

            <Link href="/manage">Manage Data</Link>
          </HStack>

          <Flex alignItems="center">
            {status === "loading" ? (
              <Text>Loading...</Text>
            ) : session ? (
              <HStack spacing={4}>
                <Text>{session.user?.email}</Text>

                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </HStack>
            ) : (
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() => signIn("google")}
              >
                Sign In
              </Button>
            )}

            <Button onClick={toggleColorMode} ml={4}>
              {colorMode === "light" ? <FaMoon /> : <GoSun />}
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
