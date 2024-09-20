"use client";
import React from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  Text,
  Container,
  Button,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

export const NavBar = () => {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const isActive = (path: string) => pathname === path;
  console.log(pathname);

  const { data: session, status } = useSession();

  return (
    <Box
      w="100%"
      h="20"
      position="sticky"
      borderBottom="1px"
    >
      <Container maxW="container.xl" h="100%">
        <Flex justify="space-between" align="center" h="100%">
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            <Link href="/" passHref>
              <Text
                as="a"
                fontWeight={isActive("/") ? "bold" : "normal"}
                textDecoration={isActive("/") ? "underline" : "none"}
                _hover={{ textDecoration: "underline" }}
              >
                Home
              </Text>
            </Link>

            <Link href="/teams" passHref>
              <Text
                as="a"
                fontWeight={isActive("/teams") ? "bold" : "normal"}
                textDecoration={isActive("/teams") ? "underline" : "none"}
                _hover={{ textDecoration: "underline" }}
              >
                View Teams
              </Text>
            </Link>

            <Link href="/matches" passHref>
              <Text
                as="a"
                fontWeight={isActive("/matches") ? "bold" : "normal"}
                textDecoration={isActive("/matches") ? "underline" : "none"}
                _hover={{ textDecoration: "underline" }}
              >
                View Recent Matches
              </Text>
            </Link>

            <Link href="/manage" passHref>
              <Text
                as="a"
                fontWeight={isActive("/manage") ? "bold" : "normal"}
                textDecoration={isActive("/manage") ? "underline" : "none"}
                _hover={{ textDecoration: "underline" }}
              >
                Manage Data
              </Text>
            </Link>

            <Link href="/logs" passHref>
              <Text
                as="a"
                fontWeight={isActive("/logs") ? "bold" : "normal"}
                textDecoration={isActive("/logs") ? "underline" : "none"}
                _hover={{ textDecoration: "underline" }}
              >
                View Logs
              </Text>
            </Link>
          </HStack>

          <Flex alignItems="center">
            {status === "loading" ? (
              <Text>Fetching user details...</Text>
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
                onClick={() => signIn('google', { callbackUrl})}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
