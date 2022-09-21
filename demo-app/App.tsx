import React, { useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import dayjs from 'dayjs';

import { Calendar, CalendarEvent } from '../src/Calendar';

const showAlert = Platform.select({
  default: Alert.alert,
  web: alert,
});

const unavailableTimeSlots = [
  {
    startDate: new Date('2022-09-07T00:00:00'),
    endDate: new Date('2022-09-07T07:00:00'),
  },
  {
    startDate: new Date('2022-09-07T09:30:00'),
    endDate: new Date('2022-09-07T10:15:00'),
  },
  {
    startDate: new Date('2022-09-07T11:00:00'),
    endDate: new Date('2022-09-07T12:00:00'),
  },
  {
    startDate: new Date('2022-09-07T14:00:00'),
    endDate: new Date('2022-09-07T17:00:00'),
  },
  {
    startDate: new Date('2022-09-07T22:00:00'),
    endDate: new Date('2022-09-07T23:59:00'),
  },
];

const startDate = new Date(2022, 8, 7);

const onEventPress = (event: CalendarEvent) => {
  showAlert(`You pressed event with id: ${event.id}`);
};

const InteractiveCalendar = () => {
  const { height } = useSafeAreaFrame();
  const { top, bottom } = useSafeAreaInsets();

  const [moreEvents, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'id-1',
      startDate: new Date(2022, 8, 7, 13, 0),
      endDate: new Date(2022, 8, 7, 13, 30),
      title: 'Event 1',
    },
    {
      id: 'id-2',
      startDate: new Date(2022, 8, 7, 12, 30),
      endDate: new Date(2022, 8, 7, 13, 0),
      title: 'Event 2',
    },
  ]);

  return (
    <Calendar
      events={moreEvents}
      onGridPress={(_event, date) => {
        setEvents((events) => [
          ...events,
          {
            id: `id-${events.length + 1}`,
            startDate: date,
            endDate: dayjs(date).add(30, 'minutes').toDate(),
            title: `Event ${events.length + 1}`,
          },
        ]);
      }}
      onEventPress={onEventPress}
      numDays={1}
      startDate={startDate}
      style={[
        styles.container,
        { height, marginTop: top, marginBottom: bottom },
      ]}
      unavailableTimeSlots={unavailableTimeSlots}
    />
  );
};

const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <InteractiveCalendar />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
