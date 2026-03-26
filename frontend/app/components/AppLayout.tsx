'use client';

import { Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/';

  return (
    <Box display="flex">
      {!isAuthPage && <Sidebar />}
      <Box
        flex={1}
        ml={!isAuthPage ? { base: 0, md: '16rem' } : 0}
        mt={!isAuthPage ? { base: '60px', md: 0 } : 0}
      >
        {children}
      </Box>
    </Box>
  );
}
