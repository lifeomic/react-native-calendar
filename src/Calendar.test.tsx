import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
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

    expect(onEventPressMock).not.toHaveBeenCalled();
    fireEvent.press(view.getByText(eventData[0].title));
    expect(onEventPressMock).toHaveBeenCalledWith(eventData[0]);
  });

  it('renders hours with correct height for default minutesStep', () => {
    const hourHeight = 123;
    const screen = render(
      <Calendar
        numDays={1}
        startDate={startDate}
        events={[]}
        hourHeight={hourHeight}
      />
    );

    expect(screen.getByTestId('8:00 AM')).toHaveStyle({
      height: hourHeight / 12,
    });
  });

  it('renders hours with correct height for custom minutesStep that is too low', () => {
    const hourHeight = 123;
    const screen = render(
      <Calendar
        numDays={1}
        startDate={startDate}
        events={[]}
        hourHeight={hourHeight}
        minutesStep={4}
      />
    );

    expect(screen.getByTestId('8:00 AM')).toHaveStyle({
      height: hourHeight / 12,
    });
  });

  it('renders hours with correct height for custom minutesStep', () => {
    const hourHeight = 123;
    const screen = render(
      <Calendar
        numDays={1}
        startDate={startDate}
        events={[]}
        hourHeight={hourHeight}
        minutesStep={15}
      />
    );

    expect(screen.getByTestId('8:00 AM')).toHaveStyle({
      height: hourHeight / 4,
    });
  });

  it('renders event.color correctly', () => {
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

    const event = screen.getByTestId('calendar-event-id-2');
    expect(event).toHaveStyle({ backgroundColor: 'green' });
  });
});
