import { HStack, Button, Box, Text } from '@chakra-ui/react';
import { DateRange } from '../types/activity';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangeSelector({
  selectedRange,
  onRangeChange,
}: DateRangeSelectorProps) {
  const ranges: { label: string; value: DateRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '6 Months', value: '6m' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <Box mb={8}>
      <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
        Date Range
      </Text>
      <HStack spacing={2}>
        {ranges.map((range) => (
          <Button
            key={range.value}
            size="sm"
            variant={selectedRange === range.value ? 'solid' : 'outline'}
            colorScheme={selectedRange === range.value ? 'orange' : 'gray'}
            onClick={() => onRangeChange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
