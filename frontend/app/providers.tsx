'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AppLayout } from './components/AppLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AppLayout>{children}</AppLayout>
    </ChakraProvider>
  );
}
