import { ReactNode } from 'react';
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
} from '@chakra-ui/react';
import {
    FiHome,
    FiMenu,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BsCalendar, BsFileEarmarkCheck, BsBook } from "react-icons/bs";
import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, path: "/" },
    { name: 'Attendance', icon: BsCalendar, path: "/attendance" },
    { name: 'Results', icon: BsFileEarmarkCheck, path: "/results" },
    { name: 'Courses', icon: BsBook, path: "/courses" }
];

export default function Sidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={"gray.100"}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            boxShadow={'lg'}
            bg={'white'}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    SAP PF
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} to={link.path}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
    to: string;
}
const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={'white'}
            borderBottomWidth="1px"
            borderBottomColor={'gray.200'}
            justifyContent="flex-start"
            {...rest}>
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                SAP PF
            </Text>
        </Flex>
    );
};