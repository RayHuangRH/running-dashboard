'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  HStack,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from '../types/activity';
import { getChartData } from '../utils/metrics';

interface TrendGraphsProps {
  activities: Activity[];
}

export default function TrendGraphs({ activities }: TrendGraphsProps) {
  const [showPace, setShowPace] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showHeartRate, setShowHeartRate] = useState(false);

  const chartData = getChartData(activities);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardBody>
          <Text color="gray.600" textAlign="center" py={8}>
            No activities to display
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <VStack align="start" spacing={6}>
          <div>
            <Heading as="h3" size="md" color="gray.900" mb={4}>
              Activity Trends
            </Heading>
            <HStack spacing={6} flexWrap="wrap">
              <Checkbox
                isChecked={showPace}
                onChange={(e) => setShowPace(e.target.checked)}
                colorScheme="blue"
              >
                <Text fontSize="sm">Pace (min/mi)</Text>
              </Checkbox>
              <Checkbox
                isChecked={showDistance}
                onChange={(e) => setShowDistance(e.target.checked)}
                colorScheme="green"
              >
                <Text fontSize="sm">Distance (miles)</Text>
              </Checkbox>
              <Checkbox
                isChecked={showHeartRate}
                onChange={(e) => setShowHeartRate(e.target.checked)}
                colorScheme="red"
              >
                <Text fontSize="sm">Heart Rate (bpm)</Text>
              </Checkbox>
            </HStack>
          </div>

          <Box w="100%" h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                  cursor={{ stroke: '#cbd5e0', strokeWidth: 1 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
                {showDistance && (
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#48bb78"
                    name="Distance (mi)"
                    dot={{ fill: '#48bb78', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    yAxisId="left"
                  />
                )}
                {showPace && (
                  <Line
                    type="monotone"
                    dataKey="pace"
                    stroke="#4299e1"
                    name="Pace (min/mi)"
                    dot={{ fill: '#4299e1', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    yAxisId="right"
                  />
                )}
                {showHeartRate && (
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#f56565"
                    name="Heart Rate (bpm)"
                    connectNulls
                    strokeWidth={2}
                    yAxisId="right"
                    isAnimationActive={false}
                  />
                )}
                <YAxis
                  yAxisId="left"
                  stroke="#48bb78"
                  label={{
                    value: 'Distance (mi)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#4299e1"
                  label={{
                    value: 'Pace (min/mi) / HR (bpm)',
                    angle: 90,
                    position: 'insideRight',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
