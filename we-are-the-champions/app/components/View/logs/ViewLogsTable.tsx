import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { logKeys, LogsWithForeignKey } from "./constants";


interface IViewLogsTableProps {
    data: LogsWithForeignKey[];
}

export const ViewLogsTable: React.FC<IViewLogsTableProps> = ({
    data,
}) => {

    return (
        <Box>
            <Box m={4} textDecoration="underline">
                Logs
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {logKeys.map((key, index) => <Th key={index}>{key}</Th>)}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item:LogsWithForeignKey) => (
                        <Tr key={item.id}>
                            <Td>
                                {item.User.name}
                            </Td>

                            <Td>

                                {item.Message}

                            </Td>

                            <Td>

                                {new Date(item.Date).toDateString()}
                            </Td>

                            <Td>
                                {item.LogType}
                            </Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};