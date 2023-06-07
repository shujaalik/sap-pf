import { useEffect, useState } from 'react'
import { auth } from '../../components/firebase';
import { Badge, Box, Button, Card, FormControl, FormLabel, GridItem, Heading, Input, Select, SimpleGrid, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { get, set } from '../../components/firebase/api/db';
import BackdropLoader from '../../components/Loaders/BackdropLoader';

const Attendance = () => {
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
      fontSize="2xl">Attendance</Heading>
    {userType === "teacher" ? <TeacherAttendace /> : <StudentAttendace />}
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
interface Student {
  id: string;
  name: string;
}
interface CourseWithStudents extends Course {
  students: Student[];
}
interface AttendanceType {
  studentName: string;
  studentId: string;
  attended: boolean | null;
}
const TeacherAttendace = () => {
  const toast = useToast();
  const [courses, setCourses] = useState<CourseWithStudents[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceType[] | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const func = async () => {
      const { uid } = auth.currentUser || {};
      if (!uid) return;
      const snaps = [
        get(`courses`),
        get(`users`),
      ];
      const [snap, snap2] = await Promise.all(snaps);
      const users = Object.fromEntries(Object.entries(snap2.val()).map(([key, value]: any) => [key, { ...value, id: key }]));
      const name = users[uid].details.name;
      const _courses: Course[] = Object.values(snap.val() || {});
      const __courses: Course[] = [];
      const _students = Object.values(users).filter((user: any) => user.type === "student");
      for (const course of _courses) {
        if (course.instructor === name) {
          __courses.push(course);
        }
      }
      const courses: CourseWithStudents[] = [];
      for (const _course of __courses) {
        const students: Student[] = [];
        for (const student of _students as any) {
          if (student.courses[_course.id]) {
            students.push({
              id: student.id,
              name: student.details.name,
            });
          }
        }
        courses.push({
          ..._course,
          students,
        });
      }
      setCourses(courses);
      setSelectedCourse(__courses[0].id);
    }
    func();
  }, []);

  useEffect(() => {
    if (!selectedCourse || !date) return;
    const attendance: AttendanceType[] = [];
    const course = courses.find(course => course.id === selectedCourse);
    for (const student of course?.students || []) {
      attendance.push({
        studentId: student.id,
        studentName: student.name,
        attended: null,
      });
    }
    setAttendance(attendance);
  }, [selectedCourse, date, courses]);

  const changeAttendance = (studentId: string, attended: boolean | null) => {
    if (!attendance) return;
    const _attendance = attendance.map(attend => {
      if (attend.studentId === studentId) {
        return {
          ...attend,
          attended,
        }
      }
      return attend;
    });
    setAttendance(_attendance);
  }

  const submit = async () => {
    if (!selectedCourse || !date || !attendance) return;
    setLoading("Submitting Attendance");
    const promises = [];
    for (const student of attendance) {
      promises.push(set(`users/${student.studentId}/attendance/${selectedCourse}/${date}`, student.attended));
    }
    await Promise.all(promises);
    toast({
      title: "Attendance Submitted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setLoading(null);
    setDate(null);
    setSelectedCourse(null);
    setAttendance(null);
  }

  return <Card
    p={5}
    borderRadius="xl"
    boxShadow="xl">
    <SimpleGrid
      mb={10}
      gap={5}
      columns={{
        base: 1,
        md: 3,
      }}>
      {loading && <BackdropLoader text={loading} />}
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Select Course</FormLabel>
          <Select onChange={e => setSelectedCourse(e.target.value)} value={selectedCourse || ""}>
            {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
          </Select>
        </FormControl>
      </GridItem>
      <FormControl>
        <FormLabel>Select Date</FormLabel>
        <Input type='date' isDisabled={selectedCourse === null} onChange={e => setDate(e.target.value)} />
      </FormControl>
    </SimpleGrid>
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Student</Th>
            <Th isNumeric>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendance?.map((student, i) => <Tr key={i}>
            <Td fontWeight={600}>{student.studentName}</Td>
            <Td isNumeric>
              <Select
                ml={"auto"}
                maxW="200px"
                onChange={e => {
                  changeAttendance(student.studentId, e.target.value === "present" ? true : e.target.value === "absent" ? false : null);
                }}>
                <option value="">Select</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </Select>
            </Td>
          </Tr>)}
        </Tbody>
        <TableCaption>
          <Button onClick={submit} isDisabled={date === null || selectedCourse === null || attendance?.some(attendance => attendance.attended === null)}>
            Submit
          </Button>
        </TableCaption>
      </Table>
    </TableContainer>
  </Card>
}

interface AttendanceUser {
  [key: string]: {
    [key: string]: boolean | null;
  };
}
interface TableData {
  date: string;
  status: boolean | null;
}
const StudentAttendace = () => {
  const [month, setMonth] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceUser | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    const func = async () => {
      const { uid } = auth.currentUser || {};
      if (!uid) return;
      const snaps = [
        get(`users/${uid}/attendance`),
        get(`users/${uid}/courses`)
      ];
      const [snap, snap2] = await Promise.all(snaps);
      const attendance = snap.val() || {};
      const courses = Object.keys(snap2.val() || {});
      setAttendance(attendance);
      setCourses(courses);
      setSelectedCourse(courses[0]);
    }
    func();
  }, []);

  useEffect(() => {
    if (!attendance || !selectedCourse || !month) return;
    const _tableData: TableData[] = [];
    const _attendance = attendance[selectedCourse];
    for (const date in _attendance) {
      if (date.startsWith(month)) {
        _tableData.push({
          date,
          status: _attendance[date],
        });
      }
    }
    setTableData(_tableData);
  }, [attendance, selectedCourse, month]);

  return <Card
    p={5}
    borderRadius="xl"
    boxShadow="xl">
    <SimpleGrid
      mb={10}
      gap={5}
      columns={{
        base: 1,
        md: 3,
      }}>
      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Select Course</FormLabel>
          <Select onChange={e => setSelectedCourse(e.target.value)} value={selectedCourse || ""} textTransform={"capitalize"}>
            {courses.map(course => <option key={course} value={course}>{course.replaceAll("-", " ")}</option>)}
          </Select>
        </FormControl>
      </GridItem>
      <FormControl>
        <FormLabel>Select Month</FormLabel>
        <Input isDisabled={attendance === null} type='month' onChange={e => setMonth(e.target.value)} />
      </FormControl>
    </SimpleGrid>
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th isNumeric>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((data, i) => <Tr key={i}>
            <Td fontWeight={600}>{Intl.DateTimeFormat().format(new Date(data.date))}</Td>
            <Td isNumeric>
              <Badge
                colorScheme={data.status === null ? "gray" : data.status ? "green" : "red"}
                fontSize={"md"}
                fontWeight={600}
                p={2}
                borderRadius={"xl"}
                textTransform={"capitalize"}
                ml={"auto"}>
                {data.status === null ? "Not Marked" : data.status ? "Present" : "Absent"}{" "}
              </Badge>
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </TableContainer>
  </Card>
}

export default Attendance