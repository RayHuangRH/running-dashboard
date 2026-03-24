'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Center,
  VStack,
  HStack,
  Image,
  Spinner,
  Link as ChakraLink,
  Card,
  CardBody,
} from '@chakra-ui/react';
import MetricsCards from '../components/MetricsCards';
import TrendGraphs from '../components/TrendGraphs';
import DateRangeSelector from '../components/DateRangeSelector';
import { getUserActivities } from '../utils/api';
import { filterActivitiesByDateRange } from '../utils/metrics';
import { Activity, DateRange } from '../types/activity';

interface AthleteData {
  strava_id: number;
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  profile_medium: string;
  profile: string;
}

export default function Dashboard() {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');

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
    console.log('loading');
    const data = await getUserActivities(userId);
    console.log('activities', data);
    setActivities(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('athleteData');
    window.location.href = '/';
  };

  const filteredActivities = filterActivitiesByDateRange(activities, dateRange);

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
      <Box bg="white" boxShadow="md" py={4}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="xl" color="gray.900">
              Running Dashboard
            </Heading>
            <Button onClick={handleLogout} colorScheme="red" size="md">
              Logout
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        {/* Athlete Profile Card */}
        <Card mb={8}>
          <CardBody>
            <HStack spacing={4} align="start">
              {athlete.profile && (
                <Image
                  src={athlete.profile}
                  alt={athlete.firstname}
                  borderRadius="full"
                  w="24"
                  h="24"
                  objectFit="cover"
                />
              )}
              <VStack align="start" spacing={1}>
                <Heading as="h2" size="md" color="gray.900">
                  {athlete.firstname} {athlete.lastname}
                </Heading>
                <Text color="gray.600">@{athlete.username}</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Date Range Selector */}
        <DateRangeSelector
          selectedRange={dateRange}
          onRangeChange={setDateRange}
        />

        {/* Key Metrics Cards */}
        <MetricsCards activities={filteredActivities} dateRange={dateRange} />

        {/* Trend Graphs */}
        <TrendGraphs activities={filteredActivities} />
      </Container>
    </Box>
  );
}
