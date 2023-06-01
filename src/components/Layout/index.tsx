import { Box } from "@chakra-ui/react";

const Layout = ({
    children
}: {
    children: JSX.Element | JSX.Element[]
}) => {
    return <Box bgColor="gray.100" minH="100vh">
        {children}
    </Box>
}

export default Layout;