import { useEffect, useState } from "react";
import { get } from "../../components/firebase/api/db";
import { auth } from "../../components/firebase";
import { Box, Button, Card, FormControl, FormLabel, HStack, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Select } from "chakra-react-select";
import { set } from "../../components/firebase/api/db";
import BackdropLoader from "../../components/Loaders/BackdropLoader";

const Courses = () => {
    const [userType, setUserType] = useState<"teacher" | "student" | null>(null);

    useEffect(() => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snap = await get(`users/${uid}/type`);
            const type = snap.val();
            setUserType(type);
        }
        func();
    }, []);

    return <Box p={8}>
        <Heading
            mb={5}
            textTransform={"capitalize"}
            letterSpacing={"wide"}
            color="gray.700"
            fontSize="2xl">Manage Courses</Heading>
        {userType === "teacher" ? <TeacherCourses /> : <StudentCourses />}
    </Box>;
}


interface Course {
    id: string;
    name: string;
    days: string[];
    start: string;
    end: string;
    creditHours: number;
    instructor: string;
}

interface CourseStudent extends Course {
    picked: boolean;
}

const StudentCourses = () => {
    const toast = useToast();
    const [courses, setCourses] = useState<null | CourseStudent[]>(null);
    const fetch = () => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snap = await get(`courses`);
            const courses: CourseStudent[] = Object.values(snap.val() || {});
            const _snap = await get(`users/${uid}/courses`);
            const myCourses = Object.keys(_snap.val() || {});
            courses.forEach(course => {
                course.picked = myCourses.includes(course.id);
            });
            setCourses(courses);
        };
        func();
    };

    useEffect(fetch, []);

    const addCourse = async (id: string) => {
        const { uid } = auth.currentUser || {};
        if (!uid) return;
        const course = courses?.find(course => course.id === id);
        if (!course) return;
        await set(`users/${uid}/courses/${course.id}`, true);
        toast({
            title: "Success",
            description: "Course added successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        fetch();
    }

    const dropCourse = async (id: string) => {
        const { uid } = auth.currentUser || {};
        if (!uid) return;
        const course = courses?.find(course => course.id === id);
        if (!course) return;
        await set(`users/${uid}/courses/${course.id}`, null);
        toast({
            title: "Success",
            description: "Course dropped successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        fetch();
    }



    return <Card
        p={5}
        borderRadius="xl"
        boxShadow="xl">
        <TableContainer mt={5}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Instructor</Th>
                        <Th>Days</Th>
                        <Th>Timing</Th>
                        <Th>Credit Hours</Th>
                        <Th isNumeric>Add Course</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {courses ? courses.map(course => <Tr key={course.id} bgColor={
                        course.picked ? "gray.100" : "white"
                    }>
                        <Td>{course.name}</Td>
                        <Td>{course.instructor}</Td>
                        <Td textTransform={"capitalize"}>{course.days.join(", ")}</Td>
                        <Td>{course.start} - {course.end}</Td>
                        <Td>{course.creditHours}</Td>
                        <Td isNumeric><IconButton
                            variant={"ghost"}
                            colorScheme={
                                course.picked ? "red" : "green"
                            }
                            onClick={() => { course.picked ? dropCourse(course.id) : addCourse(course.id) }}
                            aria-label="Add course"
                            icon={course.picked ? <AiOutlineMinus /> : <AiOutlinePlus />}
                        /></Td>
                    </Tr>) : <></>}
                </Tbody>
            </Table>
        </TableContainer>
    </Card>
};

const TeacherCourses = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [loading, setLoading] = useState<null | string>(null);
    const [courses, setCourses] = useState<null | Course[]>(null);

    const addCourse = async (e: any) => {
        e.preventDefault();
        const { name, days, start, end } = e.target;
        const daysValue: any[] = [];
        if (Array.isArray(days)) {
            days.forEach((day: any) => {
                const { value } = day;
                daysValue.push(value);
            });
        } else {
            daysValue.push(days.value);
        }
        const { value: nameValue } = name;
        const { value: startValue } = start;
        const { value: endValue } = end;
        if (!nameValue || !daysValue || !startValue || !endValue) return;
        if (startValue > endValue) {
            toast({
                title: "Error",
                description: "Start time cannot be greater than end time",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        const { uid } = auth.currentUser || {};
        if (!uid) return;
        setLoading("Adding course");
        const creditHours = Math.floor((new Date(`2021-01-01T${endValue}:00`).getTime() - new Date(`2021-01-01T${startValue}:00`).getTime()) / 3600000);
        const id = nameValue.toLowerCase().replace(/\s/g, "-");
        const snap = await get(`users/${uid}/details/name`);
        const instructor = snap.val();
        const payload: Course = {
            id,
            name: nameValue,
            days: daysValue,
            start: startValue,
            end: endValue,
            creditHours,
            instructor
        };
        await set(`courses/${id}`, payload);
        onClose();
        toast({
            title: "Success",
            description: "Course added successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        setLoading(null);
        fetch();
    };

    const fetch = () => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snap = await get(`courses`);
            const courses: Course[] = Object.values(snap.val() || {});
            setCourses(courses);
        };
        func();
    };

    useEffect(fetch, []);

    return <Card
        p={5}
        borderRadius="xl"
        boxShadow="xl">
        {loading && <BackdropLoader text={loading} />}
        <Modal onClose={onClose} size={"xl"} isOpen={isOpen} closeOnEsc={false} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Course</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={addCourse}>
                    <ModalBody>
                        <VStack>
                            <FormControl>
                                <FormLabel>Name of course</FormLabel>
                                <Input type='text' name="name" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Days</FormLabel>
                                <Select
                                    isMulti
                                    name="days"
                                    options={[{
                                        label: "Monday",
                                        value: "monday"
                                    }, {
                                        label: "Tuesday",
                                        value: "tuesday"
                                    }, {
                                        label: "Wednesday",
                                        value: "wednesday"
                                    }, {
                                        label: "Thursday",
                                        value: "thursday"
                                    }, {
                                        label: "Saturday",
                                        value: "saturday"
                                    }, {
                                        label: "Sunday",
                                        value: "sunday"
                                    }]}
                                    placeholder="Select days..."
                                    closeMenuOnSelect={false}
                                />
                            </FormControl>
                            <HStack w="100%">
                                <FormControl>
                                    <FormLabel>Start Timing</FormLabel>
                                    <Input name="start" type='time' />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>End Timing</FormLabel>
                                    <Input name="end" type='time' />
                                </FormControl>
                            </HStack>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={"red"} onClick={onClose} mr={3}>Close</Button>
                        <Button colorScheme={"blue"} type="submit">Add</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
        <Button colorScheme={"blue"} w="fit-content" ml={"auto"} rightIcon={<AiOutlinePlus />} onClick={onOpen}>Add Course</Button>
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
                    {courses ? courses.map(course => <Tr key={course.id}>
                        <Td>{course.name}</Td>
                        <Td>{course.instructor}</Td>
                        <Td textTransform={"capitalize"}>{course.days.join(", ")}</Td>
                        <Td>{course.start} - {course.end}</Td>
                        <Td isNumeric>{course.creditHours}</Td>
                    </Tr>) : <></>}
                </Tbody>
            </Table>
        </TableContainer>
    </Card>
};

export default Courses