import dayjs from 'dayjs';

import {
  UseEventData,
  useEventData,
  UseTimesList,
  useTimesList,
} from './utils';

import { renderHook } from '../../../test/hook-render';

describe('useEventData', () => {
  const defaultEventProps = {
    events: [
      {
        id: 'id',
        endDate: new Date(2022, 8, 7, 12, 0),
        startDate: new Date(2022, 8, 7, 12, 30),
        title: 'Test Event',
      },
    ] as UseEventData['events'],
    numDays: 1 as UseEventData['numDays'],
    startDate: new Date(2022, 8, 7),
    unavailableTimeSlots: [
      {
        startDate: new Date('2022-09-07T11:00:00'),
        endDate: new Date('2022-09-07T12:00:00'),
      },
    ] as UseEventData['unavailableTimeSlots'],
  };

  it('works for 1 day', async () => {
    const { result, waitFor } = renderHook(() =>
      useEventData({ ...defaultEventProps }),
    );

    await waitFor(() => result.current.length > 0);

    expect(result.current.length).toBe(1);
    expect(result.current[0].date.isSame('2022-09-07')).toBe(true);
    expect(result.current[0].events.length).toBe(1);
    expect(result.current[0].unavailableTimeSlots?.length).toBe(1);
  });

  it('works for 7 day', async () => {
    const { result, waitFor } = renderHook(() =>
      useEventData({ ...defaultEventProps, numDays: 7 }),
    );

    await waitFor(() => result.current.length > 0);

    expect(result.current.length).toBe(7);
    expect(result.current[0].date.isSame('2022-09-04')).toBe(true);
    expect(result.current[6].date.isSame('2022-09-10')).toBe(true);
    for (let index = 0; index < 7; index++) {
      expect(result.current[index].events.length).toBe(index === 3 ? 1 : 0);
      expect(result.current[index].unavailableTimeSlots?.length).toBe(
        index === 3 ? 1 : 0,
      );
    }
  });
});

describe('useTimesList', () => {
  const defaultTimesProps = {
    date: dayjs('2022-09-07'),
    formatTimeLabel: 'h A',
    height: 10,
    minutesStep: 60 as UseTimesList['minutesStep'],
    unavailableTimeSlots: [
      {
        startDate: new Date('2022-09-07T11:00:00'),
        endDate: new Date('2022-09-07T12:00:00'),
      },
    ] as UseTimesList['unavailableTimeSlots'],
  };

  it('works', async () => {
    const { result, waitFor } = renderHook(() =>
      useTimesList({ ...defaultTimesProps }),
    );

    await waitFor(() => result.current.length > 0);

    expect(result.current.length).toBe(24);
    expect(result.current[0].date.isSame('2022-09-07')).toBe(true);
    expect(result.current[0].disabled).toBe(false);
    expect(result.current[0].height).toBe(10);
    expect(result.current[0].time).toBe('12 AM');
    expect(result.current[23].date.isSame('2022-09-07')).toBe(true);
    expect(result.current[23].disabled).toBe(false);
    expect(result.current[23].height).toBe(10);
    expect(result.current[23].time).toBe('11 PM');
  });
});
