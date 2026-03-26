'use client';

import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  Divider,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Heading,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiBarChart2, FiMap } from 'react-icons/fi';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard', icon: FiBarChart2, href: '/dashboard' },
  { label: 'Map', icon: FiMap, href: '/map' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SidebarContent = (
    <VStack spacing={0} align="stretch" h="full">
      <VStack spacing={8} align="stretch" p={6} flex={1}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <HStack
                spacing={4}
                p={3}
                rounded="lg"
                cursor="pointer"
                bg={isActive ? 'orange.50' : 'transparent'}
                borderLeft="4px"
                borderLeftColor={isActive ? 'orange.500' : 'transparent'}
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
              >
                <Icon
                  as={item.icon}
                  w={5}
                  h={5}
                  color={isActive ? 'orange.500' : 'gray.600'}
                />
                <Text
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? 'orange.500' : 'gray.700'}
                >
                  {item.label}
                </Text>
              </HStack>
            </Link>
          );
        })}
      </VStack>
      <Divider />
      <Box p={4} bg="gray.50">
        <Text fontSize="xs" color="gray.500">
          © 2026 Running Dashboard
        </Text>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top={4}
        left={4}
        zIndex={40}
      >
        <IconButton
          aria-label="Open menu"
          icon={<FiMenu />}
          onClick={onOpen}
          variant="ghost"
          size="lg"
        />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0}>{SidebarContent}</DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        w="64"
        bg="white"
        h="100vh"
        boxShadow="md"
        position="fixed"
        left={0}
        top={0}
        borderRight="1px"
        borderRightColor="gray.200"
      >
        {SidebarContent}
      </Box>
    </>
  );
}
