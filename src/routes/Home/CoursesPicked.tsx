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
} from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { get } from "../../components/firebase/api/db";
import { auth } from "../../components/firebase";

interface Course {
    id: string;
    name: string;
    days: string[];
    start: string;
    end: string;
    creditHours: number;
    instructor: string;
}
const CoursesPicked = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snaps = [
                get(`users/${uid}/courses`),
                get(`courses`),
                get(`users/${uid}/type`),
                get(`users/${uid}/details/name`),
            ];
            const [snap, snap2, snap3, snap4] = await Promise.all(snaps);
            const type: "teacher" | "student" = snap3.val();
            const courses: Course[] = [];
            const allCourses: Course[] = Object.values(snap2.val() || {});
            if (type === "student") {
                const userCourses = Object.keys(snap.val() || {});
                for (const course of allCourses) {
                    if (userCourses.includes(course.id)) {
                        courses.push(course);
                    }
                }
            }else{
                const name = snap4.val();
                for (const course of allCourses) {
                    if (course.instructor === name) {
                        courses.push(course);
                    }
                }
            }
            setCourses(courses);
        }
        func();
    }, []);

    return <Card
        minHeight={"400px"}
        w="100%"
        p={5}
        borderRadius="xl"
        boxShadow="xl">
        <Text fontWeight={600} fontSize="md">Your Courses</Text>
        <TableContainer mt={5}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Instructor</Th>
                        <Th>Days</Th>
                        <Th>Timing</Th>
                        <Th isNumeric>Credit Hours</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {courses.map((course, i) => <Tr key={i}>
                        <Td>{course.name}</Td>
                        <Td>{course.instructor}</Td>
                        <Td textTransform={"capitalize"}>{course.days.join(", ")}</Td>
                        <Td>{course.start} - {course.end}</Td>
                        <Td isNumeric>{course.creditHours}</Td>
                    </Tr>)}
                </Tbody>
            </Table>
        </TableContainer>
    </Card>
}

export default CoursesPicked