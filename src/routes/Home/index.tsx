import { Box, Flex, GridItem, Heading, Image, SimpleGrid, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { auth } from "../../components/firebase";
import Quote from "./Quote";
import quoteBG from "../../assets/images/quote-bg.svg";
import Students from "../../assets/images/students.svg";
import SideTimeTable from "./SideTimeTable";
import { get } from "../../components/firebase/api/db";
import CoursesPicked from "./CoursesPicked";

const Home = () => {
  const [greeting, setGreeting] = useState("");

  // eslint-disable-next-line
  useEffect(() => {
    const func = async () => {
      const { uid } = auth.currentUser || {};
      if (!uid) return;
      const snaps = [get(`users/${uid}/details/name`), get(`users/${uid}/type`)];
      const [snap, snap2] = await Promise.all(snaps);
      const type = snap2.val();
      const displayName = snap.val();
      const hour = new Date().getHours();
      let text = "";
      if (hour >= 0 && hour < 12) text = "Good Morning";
      if (hour >= 12 && hour < 17) text = "Good Afternoon";
      if (hour >= 17 && hour < 20) text = "Good Evening";
      if (hour >= 20 && hour < 24) text = "Good Night";
      text += `, ${displayName || type}👋`;
      setGreeting(text);
    }
    func();
  }, []);

  return <Box p={8}>
    <Heading
      textTransform={"capitalize"}
      letterSpacing={"wide"}
      color="gray.700"
      fontSize="2xl">{greeting}</Heading>
    <SimpleGrid columns={{
      base: 1,
      xl: 3
    }} mt={15} spacing={5}>
      <GridItem colSpan={2}>
        <VStack spacing={5}>
          <Flex
            w="100%"
            flexDir={{
              base: "column",
              md: "row"
            }}
            justifyContent="space-between"
            alignItems={"center"}
            minH={"150px"}
            borderRadius="xl"
            boxShadow="xl"
            bgSize="cover"
            bgRepeat={"no-repeat"}
            bgImage={quoteBG}>
            <Quote m={10} fontWeight={500} size="md" color={"whiteAlpha.900"} />
            <Image h="150px" p={2} src={Students} />
          </Flex>
          <CoursesPicked />
        </VStack>
      </GridItem>
      <GridItem>
        <SideTimeTable />
      </GridItem>
    </SimpleGrid>
  </Box>
}

export default Home;