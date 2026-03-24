import {
  Grid,
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import { Activity, DateRange } from '../types/activity';
import { calculateMetrics, getDateRangeLabel } from '../utils/metrics';
import {
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiHeart,
  FiCalendar,
  FiTarget,
} from 'react-icons/fi';

interface MetricsCardsProps {
  activities: Activity[];
  dateRange: DateRange;
}

export default function MetricsCards({
  activities,
  dateRange,
}: MetricsCardsProps) {
  const metrics = calculateMetrics(activities);
  const rangeLabel = getDateRangeLabel(dateRange);

  const statCards = [
    {
      label: 'Total Runs',
      value: metrics.totalRuns,
      icon: FiActivity,
      color: 'orange.500',
    },
    {
      label: 'Avg Distance',
      value: `${metrics.avgDistance.toFixed(2)} mi`,
      icon: FiTrendingUp,
      color: 'blue.500',
    },
    {
      label: 'Avg Pace',
      value: metrics.avgPace,
      icon: FiZap,
      color: 'green.500',
    },
    {
      label: 'Avg Heart Rate',
      value: `${metrics.avgHeartRate.toFixed(0)} bpm`,
      icon: FiHeart,
      color: 'red.500',
    },
    {
      label: rangeLabel,
      value: `${metrics.monthDistance.toFixed(1)} mi`,
      icon: FiCalendar,
      color: 'purple.500',
    },
    {
      label: 'Longest Run',
      value: `${metrics.longestRun.toFixed(2)} mi`,
      icon: FiTarget,
      color: 'cyan.500',
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={4}
      mb={8}
    >
      {statCards.map((stat, idx) => (
        <Card key={idx} borderTop="4px" borderTopColor={stat.color}>
          <CardBody>
            <HStack mb={4} spacing={3}>
              <Icon as={stat.icon} w={6} h={6} color={stat.color} />
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                {stat.label}
              </Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {stat.value}
            </Text>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}
