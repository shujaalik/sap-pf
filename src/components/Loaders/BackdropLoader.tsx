import { Box, VStack, Spinner, Text } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

const BackdropLoader = ({
    text = "Loading"
}: {
    text?: string
}) => {

    return <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgColor={"blackAlpha.700"}
        color={"primary"}
        zIndex={9999}>
        <VStack>
            <Spinner
                color={"primary"}
                size="xl" />
            <Text color="#ccc" textAlign={"center"}>{text ? text + "..." : text}</Text>
        </VStack>
    </Box>
}

export default BackdropLoader;