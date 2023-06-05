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
const SideTimeTable = () => {
    const [events, setEvents] = useState<Event[]>([{
        title: "Personal Development",
        date: "2023-06-06",
        time: {
            start: "11:45",
            end: "14:45"
        }
    }, {
        title: "Linear Algebra",
        date: "2023-06-06",
        time: {
            start: "15:00",
            end: "18:00"
        }
    }]);
    const [selectedDate, setSelectedDate] = useState<null | {
        date: string;
        events: Event[];
    }>(null);
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