import {
    Card,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
} from "@chakra-ui/react"
import { useEffect, useState } from "react";

const Scoring = () => {
    const [scores, setScores] = useState<null | {
        name: string;
        course: string;
        date: string;
        status: string;
        grade: string;
    }[]>(null);

    useEffect(() => {
        setScores([{
            name: "Quiz 1",
            course: "Mathematics",
            date: "12/12/2021",
            status: "Submitted",
            grade: "80/100"
        }, {
            name: "Quiz 2",
            course: "Mathematics",
            date: "12/12/2021",
            status: "Late",
            grade: "30/100"
        }]);
    }, []);

    return <Card
        w="100%"
        p={5}
        borderRadius="xl"
        boxShadow="xl">
        <Text fontWeight={600} fontSize="md">Quizes/Assignmments</Text>
        <TableContainer mt={5}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Course</Th>
                        <Th>Date of Submission</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Grade</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {scores ? scores.map((score, i) => <Tr key={i}>
                        <Td>{score.name}</Td>
                        <Td>{score.course}</Td>
                        <Td>{score.date}</Td>
                        <Td>
                            <Badge
                                borderRadius={"md"}
                                fontSize={"sm"}
                                px={2}
                                py={1}
                                colorScheme={
                                    score.status === "Submitted" ? "green" :
                                        score.status === "Late" ? "red" :
                                            "yellow"
                                }
                            >{score.status}</Badge>
                        </Td>
                        <Td isNumeric fontWeight={500}>{score.grade}</Td>
                    </Tr>)
                        : <Tr>
                            <Td colSpan={5} textAlign={"center"} fontWeight={500} color="gray.500" h="200px">No scores yet!</Td>
                        </Tr>}
                </Tbody>
            </Table>
        </TableContainer>
    </Card>
}

export default Scoring