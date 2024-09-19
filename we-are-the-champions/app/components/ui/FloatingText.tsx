"use client"
import { Flex, Text, keyframes, Box } from '@chakra-ui/react';
import { GiChampions } from "react-icons/gi";

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

export const FloatingText = () => {
    return (
        <Flex
            justify="flex-start"
            align="center"
            height="100vh"
            direction="column"
            textAlign="center"
            pt={20} 
        >
            <GiChampions size="150px" />

            <Text
                fontSize="4xl"
                fontWeight="bold"
                mt={4}
                animation={`${floatAnimation} 3s ease-in-out infinite`}
            >
                Welcome to
            </Text>
            <Text
                fontSize="4xl"
                fontWeight="bold"
                animation={`${floatAnimation} 3s ease-in-out infinite`}
            >
                We Are The Champions
            </Text>

            <Box mt={8} color="gray.400">
                <Text fontSize="lg">
                    Click on the Nav Bar now to view teams/matches
                </Text>
                <Text fontSize="lg">
                    and Sign In to manage data/view logs.
                </Text>
            </Box>
        </Flex>
    );
}
