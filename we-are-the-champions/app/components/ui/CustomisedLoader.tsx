import { Flex, Spinner } from "@chakra-ui/react"


export const CustomisedLoader = () => {
    return (
        <Flex justifyContent="center" alignItems="center" minHeight="200px">
            <Spinner size="md" />
        </Flex>
    )
}