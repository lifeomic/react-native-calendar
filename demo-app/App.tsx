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

const startDate = dayjs('2022-09-07');

const unavailableTimeSlots = [
  {
    startDate: startDate,
    endDate: startDate.set('h', 7),
  },
  {
    startDate: startDate.set('h', 9).set('minutes', 30),
    endDate: startDate.set('h', 10).set('minutes', 30),
  },
  {
    startDate: startDate.set('h', 11),
    endDate: startDate.set('h', 12),
  },
  {
    startDate: startDate.set('h', 14),
    endDate: startDate.set('h', 17),
  },
  {
    startDate: startDate.set('h', 22),
    endDate: startDate.set('h', 24),
  },
];

const onEventPress = (event: CalendarEvent) => {
  showAlert(`You pressed event with id: ${event.id}`);
};

const InteractiveCalendar = () => {
  const { height } = useSafeAreaFrame();
  const { top, bottom } = useSafeAreaInsets();

  const [moreEvents, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'id-1',
      startDate: startDate.set('h', 8).toDate(),
      endDate: startDate.set('h', 8).set('minutes', 45).toDate(),
      title: 'Event 1',
    },
    {
      id: 'id-2',
      startDate: startDate.set('h', 14).toDate(),
      endDate: startDate.set('h', 14).set('minutes', 45).toDate(),
      title: 'Event 2',
    },
    {
      id: 'id-3',
      startDate: startDate.set('h', 16).set('minutes', 30).toDate(),
      endDate: startDate.set('h', 17).set('minutes', 45).toDate(),
      title: 'Event 3',
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
            endDate: dayjs(date).add(45, 'minutes').toDate(),
            title: `Event ${events.length + 1}`,
          },
        ]);
      }}
      onEventPress={onEventPress}
      startDate={startDate.toDate()}
      style={[
        styles.container,
        { height, marginTop: top, marginBottom: bottom },
      ]}
      unavailableTimeSlots={unavailableTimeSlots.map((slot) => ({
        startDate: slot.startDate.toDate(),
        endDate: slot.endDate.toDate(),
      }))}
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
