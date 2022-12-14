import React from 'react';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import dayjs from 'dayjs';
import { TimeSlot } from './TimeSlot';

const baseTime = {
  date: dayjs().startOf('day'),
  disabled: false,
  height: 0,
};

describe('TimeSlot', () => {
  it('renders TimeSlot without onGridPress', () => {
    const view = render(<TimeSlot time={{ ...baseTime, time: '11:45 AM' }} />);

    expect(view.queryByTestId('11:45 AM')).toBeTruthy();

    expect(view.getByTestId('11:45 AM')).not.toBeDisabled();
  });

  it('renders TimeSlot with onGridPress but disabled', () => {
    const onGridPressMock = jest.fn();
    const view = render(
      <TimeSlot
        onGridPress={onGridPressMock}
        time={{ ...baseTime, disabled: true, time: '11:45 AM' }}
      />
    );

    expect(view.queryByTestId('11:45 AM')).toBeTruthy();
    expect(view.getByTestId('11:45 AM')).toBeDisabled();

    fireEvent.press(view.getByTestId('11:45 AM'));

    expect(onGridPressMock).not.toHaveBeenCalled();
  });

  it('renders TimeSlot with onGridPress, not disabled, with a morning time', () => {
    const onGridPressMock = jest.fn();
    const view = render(
      <TimeSlot
        onGridPress={onGridPressMock}
        time={{ ...baseTime, time: '11:45 AM' }}
      />
    );

    expect(view.queryByTestId('11:45 AM')).toBeTruthy();

    fireEvent.press(view.getByTestId('11:45 AM'));

    expect(onGridPressMock).toHaveBeenCalledWith(
      undefined,
      dayjs().startOf('day').hour(11).minute(45).toDate()
    );
  });

  it('renders TimeSlot with onGridPress, not disabled, at Noon', () => {
    const onGridPressMock = jest.fn();
    const view = render(
      <TimeSlot
        onGridPress={onGridPressMock}
        time={{ ...baseTime, time: 'Noon' }}
      />
    );

    expect(view.queryByTestId('12:00 PM')).toBeTruthy();

    fireEvent.press(view.getByTestId('12:00 PM'));

    expect(onGridPressMock).toHaveBeenCalledWith(
      undefined,
      dayjs().startOf('day').hour(12).toDate()
    );
  });

  it('renders TimeSlot with onGridPress, not disabled, with an afternoon time', () => {
    const onGridPressMock = jest.fn();
    const view = render(
      <TimeSlot
        onGridPress={onGridPressMock}
        time={{ ...baseTime, time: '3:15 PM' }}
      />
    );

    expect(view.queryByTestId('3:15 PM')).toBeTruthy();

    fireEvent.press(view.getByTestId('3:15 PM'));

    expect(onGridPressMock).toHaveBeenCalledWith(
      undefined,
      dayjs().startOf('day').hour(15).minute(15).toDate()
    );
  });
});
