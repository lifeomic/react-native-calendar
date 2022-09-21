import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { Calendar } from './Calendar';

const eventData = [
  {
    id: 'id-1',
    startDate: new Date(2022, 8, 7, 13, 0),
    endDate: new Date(2022, 8, 7, 13, 30),
    title: 'Event 1',
  },
];

const unavailableTimeSlots = [
  {
    startDate: new Date('2022-09-07T00:00:00'),
    endDate: new Date('2022-09-07T07:00:00'),
  },
];

const startDate = new Date(2022, 8, 7);

describe('Calendar', () => {
  it('renders Calendar without onGridPress', () => {
    const onEventPressMock = jest.fn();

    const view = render(
      <Calendar
        events={eventData}
        numDays={1}
        onEventPress={onEventPressMock}
        startDate={startDate}
        unavailableTimeSlots={unavailableTimeSlots}
      />
    );

    expect(view.queryByTestId('calendar')).toBeTruthy();
    fireEvent(view.getByTestId('calendar'), 'layout', {
      nativeEvent: { layout: { height: 500, width: 500 } },
    });

    expect(onEventPressMock).not.toHaveBeenCalled();
    fireEvent.press(view.getByText(eventData[0].title));
    expect(onEventPressMock).toHaveBeenCalledWith(eventData[0]);
  });

  it('renders event.color correctly', async () => {
    const screen = render(
      <Calendar
        numDays={1}
        startDate={startDate}
        events={[
          {
            id: 'id-2',
            startDate: new Date(2022, 8, 7, 13, 0),
            endDate: new Date(2022, 8, 7, 13, 30),
            title: 'Custom Color Event',
            color: 'green',
          },
        ]}
      />
    );

    fireEvent(screen.getByTestId('calendar'), 'layout', {
      nativeEvent: { layout: { height: 500, width: 500 } },
    });

    const event = await waitFor(() =>
      screen.getByTestId('calendar-event-id-2')
    );
    expect(event).toHaveStyle({ backgroundColor: 'green' });
  });
});
