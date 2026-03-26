'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  VStack,
  Heading,
  Text,
  Spinner,
  Link as ChakraLink,
  HStack,
  Button,
  Select,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { getUserActivities } from '../utils/api';
import { createHeatmapData } from '../utils/polyline';
import { Activity, DateRange } from '../types/activity';
import { filterActivitiesByDateRange } from '../utils/metrics';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
const HeatmapComponent = dynamic(
  () =>
    import('../components/HeatmapVisualization').then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <Center h="600px">
        <Spinner size="lg" color="orange.500" />
      </Center>
    ),
  }
) as any;

interface AthleteData {
  strava_id: number;
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  profile_medium: string;
  profile: string;
}

export default function MapPage() {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('all');

  useEffect(() => {
    const athleteData = localStorage.getItem('athleteData');
    if (athleteData) {
      setAthlete(JSON.parse(athleteData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (athlete?.user_id) {
      loadActivities(athlete.user_id);
    }
  }, [athlete?.user_id]);

  const loadActivities = async (userId: string) => {
    const data = await getUserActivities(userId);
    setActivities(data);
  };

  const filteredActivities = filterActivitiesByDateRange(activities, dateRange);
  const polylines = filteredActivities
    .map((a) => a.gps_polyline)
    .filter(Boolean) as string[];
  const heatmapData = createHeatmapData(polylines);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="orange.500"
          size="lg"
        />
      </Center>
    );
  }

  if (!athlete) {
    return (
      <Center minH="100vh">
        <VStack spacing={4} textAlign="center">
          <Text color="gray.600">No athlete data found</Text>
          <ChakraLink href="/" color="orange.500" fontWeight="semibold">
            Return to login
          </ChakraLink>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" boxShadow="md" py={4} pl={{ base: 20, md: 80 }}>
        <Box maxW="7xl" mx="auto" px={6}>
          <Heading as="h1" size="xl" color="gray.900">
            Route Heatmap
          </Heading>
          <Text color="gray.600" fontSize="sm" mt={1}>
            Most frequently ran routes based on your GPS data
          </Text>
        </Box>
      </Box>

      {/* Main Content */}
      <Box pl={{ base: 20, md: 80 }} py={8}>
        <Box maxW="7xl" mx="auto" px={6}>
          {/* Controls */}
          <Card mb={6}>
            <CardBody>
              <HStack spacing={4} align="end">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                    Time Period
                  </Text>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                    w="200px"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="all">All Time</option>
                  </Select>
                </VStack>
                <Text fontSize="sm" color="gray.600">
                  {filteredActivities.length} activities • {polylines.length}{' '}
                  routes with GPS data
                </Text>
              </HStack>
            </CardBody>
          </Card>

          {/* Map */}
          {polylines.length > 0 ? (
            <Card>
              <CardBody p={0} rounded="lg" overflow="hidden">
                <HeatmapComponent heatmapData={heatmapData} />
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <Center py={16}>
                  <VStack spacing={3} textAlign="center">
                    <Text color="gray.600">
                      No GPS polyline data available for the selected period
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Your activities will show up here once they include GPS
                      data
                    </Text>
                  </VStack>
                </Center>
              </CardBody>
            </Card>
          )}

          {/* Legend */}
          <Card mt={6}>
            <CardBody>
              <VStack align="start" spacing={3}>
                <Heading as="h3" size="sm" color="gray.900">
                  How to read the heatmap
                </Heading>
                <Text fontSize="sm" color="gray.700">
                  Darker colors indicate routes you run more frequently. Each
                  run contributes to the visualization based on your GPS
                  polyline data.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
