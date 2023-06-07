import { Avatar, Box, Card, Divider, Flex, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { useEffect, useState } from "react";
import { get } from "../../components/firebase/api/db";
import { auth } from "../../components/firebase";

const UserSection = () => {
    const [user, setUser] = useState<null | {
        name: string;
        program: string;
    }>(null);

    useEffect(() => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snap = await get(`users/${uid}/details`);
            const { name, program } = snap.val();
            setUser({ name, program });
        }
        func();
    }, []);

    return <Flex pb="5" justifyContent={"space-between"} alignItems={"center"}>
        <HStack spacing={4}>
            <Avatar
                boxShadow="xl"
                size="md"
                name={user?.name} />
            <Box>
                <Text fontWeight={600}>
                    {user?.name}
                </Text>
                <Text fontSize="sm" color="gray.400">
                    {user?.program}
                </Text>
            </Box>
        </HStack>
        <Text
            _before={{
                content: '"•"',
                mr: 1,
                fontSize: "3xl",
                verticalAlign: "middle",
            }}
            fontSize="sm"
            color="green"
            fontWeight={500}>
            online
        </Text>
    </Flex>
}
type Event = {
    title: string;
    date: string;
    time: {
        start: string;
        end: string;
    };
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
const SideTimeTable = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<null | {
        date: string;
        events: Event[];
    }>(null);

    useEffect(() => {
        const func = async () => {
            const { uid } = auth.currentUser || {};
            if (!uid) return;
            const snaps = [
                get(`users/${uid}/courses`),
                get(`courses`),
                get(`users/${uid}/type`),
                get(`users/${uid}/details/name`)
            ];
            const [snap, snap2, snap3, snap4] = await Promise.all(snaps);
            const type: "teacher" | "student" = snap3.val();
            const courses: Course[] = [];
            if (type === "student") {
                const allCourses: Course[] = Object.values(snap2.val() || {});
                const userCourses = Object.keys(snap.val() || {});
                for (const course of allCourses) {
                    if (userCourses.includes(course.id)) {
                        courses.push(course);
                    }
                }
            } else {
                const allCourses: Course[] = Object.values(snap2.val() || {});
                const name = snap4.val();
                for (const course of allCourses) {
                    if (course.instructor === name) {
                        courses.push(course);
                    }
                }
            }
            const _events: Event[] = [];
            for (const course of courses) {
                for (const day of course.days) {
                    const date = new Date();
                    while (date.getMonth() === new Date().getMonth()) {
                        if (date.getDay() === ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(day)) {
                            const _date = date.toISOString().slice(0, 10);
                            const _time = {
                                start: course.start,
                                end: course.end
                            };
                            _events.push({
                                title: course.name,
                                date: _date,
                                time: _time
                            });
                        }
                        date.setDate(date.getDate() + 1);
                    }
                }
            }
            setEvents(_events);
            const today = new Date().toISOString().slice(0, 10);
            setTimeout(() => {
                handleDateClick({ dateStr: today });
            }, 100);
        }
        func();
        // eslint-disable-next-line
    }, []);

    const handleDateClick = (e: any) => {
        let { dateStr, event } = e;
        if (!dateStr) dateStr = event.startStr;
        const _events = events.filter(event => event.date === dateStr);
        setSelectedDate({
            date: dateStr,
            events: _events
        });
    }

    return <Card p={5}
        borderRadius="xl"
        boxShadow="xl">
        <UserSection />
        <Divider color="gray.300" />
        <Box py={5}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
                themeSystem="bootstrap5"
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                eventClick={handleDateClick}
                events={events || []}
            />
        </Box>
        <Divider color="gray.300" />
        <Box py={5}>
            {selectedDate && <>
                <HStack w="100%" justifyContent={"space-between"}>
                    <Text fontWeight={500} fontSize={"lg"}>{new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'full',
                    }).format(new Date(selectedDate.date))}</Text>
                    <Text fontSize="sm"><strong>{selectedDate.events.length}</strong> class(s)</Text>
                </HStack>
                <VStack my={8} spacing={5} maxH="400px" overflow={"auto"}>
                    {
                        selectedDate.events.length === 0 ?
                            <Heading size="sm" color="gray.400">No Classes for this day</Heading>
                            : <>
                                {selectedDate.events.map((event, i) => <Box key={i} w="100%" bgColor={"gray.100"} p={3} borderRadius={"md"}>
                                    <Text fontWeight={500} fontSize={"sm"}>{event.title}</Text>
                                    <HStack w="100%" justifyContent={"space-between"}>
                                        <Text fontSize="sm" fontWeight={500} color="blue.500">{event.time.start} - {event.time.end}</Text>
                                        <Text fontSize="sm" fontWeight={500} color="orange.500">{
                                            ["1st", "2nd", "3rd", "4th", "5th", "6th"][i]
                                        } class</Text>
                                    </HStack>
                                </Box>)}
                            </>
                    }
                </VStack>
            </>}
        </Box>
    </Card>
}

export default SideTimeTable