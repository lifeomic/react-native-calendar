import { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { Calendar } from '../src/Calendar';

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

const InteractiveCalendar = () => {
  const [moreEvents, setEvents] = useState<any[]>([
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
      style={{
        margin: 15,
        borderColor: 'blue',
        borderWidth: 1,
      }}
      events={moreEvents}
      onGridPress={(e, date) => {
        setEvents((events) => [
          ...events,
          {
            id: `id-${events.length + 1}`,
            startDate: date,
            endDate: dayjs(date).add(30, 'minutes'),
            title: `Event ${events.length + 1}`,
          },
        ]);
      }}
      onEventPress={(e) => {
        alert(`You pressed event with id: ${e.id}`);
      }}
      numDays={1}
      startDate={startDate}
      unavailableTimeSlots={unavailableTimeSlots}
    />
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <InteractiveCalendar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    height: 600,
    width: 350,
    backgroundColor: '#fff',
  },
});
