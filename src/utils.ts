import { useMemo } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';

import type { CalendarProps, TimeSlot } from './Calendar';

dayjs.extend(isBetween);
dayjs.extend(weekday);

const BEGIN_AT = 0;
const MINUTES_IN_DAY = 60 * 24;

export type UseEventData = Pick<
  CalendarProps,
  'events' | 'numDays' | 'startDate' | 'unavailableTimeSlots'
>;

/**
 * split up event and unavailableTimeSlots data into an array
 * format which is easy to render for different calendar sizes
 *
 * note: this currently supports day and week handling but the
 * Calendar UI is not designed optimally yet for week usage
 */
export const useEventData = (data: UseEventData) => {
  const { events, numDays, startDate, unavailableTimeSlots } = data;

  const eventStartDate =
    numDays === 7 ? dayjs(startDate).startOf('week') : dayjs(startDate);
  const eventStartDateString = eventStartDate.valueOf();

  const eventData = useMemo(
    () => {
      const newEventData: Array<
        Pick<UseEventData, 'events' | 'unavailableTimeSlots'> & {
          date: dayjs.Dayjs;
        }
      > = [];
      for (let day = 0; day < numDays; day++) {
        const date = eventStartDate.add(day, 'day');
        const startOfDay = date.startOf('day');
        const endOfDay = date.endOf('day');
        newEventData.push({
          date,
          events: events.filter((event) =>
            dayjs(event.startDate).isBetween(startOfDay, endOfDay, 'day', '[]')
          ),
          unavailableTimeSlots: unavailableTimeSlots?.filter((timeSlot) =>
            date.isBetween(timeSlot.startDate, timeSlot.endDate, 'day', '[]')
          ),
        });
      }
      return newEventData;
    },
    // eventStartDateString is being used for eventStartDate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, eventStartDateString, numDays, unavailableTimeSlots]
  );

  return eventData;
};

export type UseTimesList = {
  date?: dayjs.Dayjs;
  formatTimeLabel: string;
  height: number;
  /**
   * we support 15 minute intervals within the calendar as
   * events can start/end on intervals :00 :15 :30 :45
   *
   * we support 60 minute intervals to show on the left side
   * of the calendar for daily time labels
   */
  minutesStep: 15 | 60;
  unavailableTimeSlots?: TimeSlot[];
};

export type TimeSlotItem = {
  date: dayjs.Dayjs;
  disabled?: boolean;
  height: number;
  time: string;
};

/**
 * gets the times to display for the calendar and controls
 * the enabled/disabled display of those time slots
 */
export const useTimesList = (props: UseTimesList) => {
  const { date, formatTimeLabel, height, minutesStep, unavailableTimeSlots } =
    props;

  const StartOfDate = dayjs(date).startOf('day');
  const startOfDateString = StartOfDate.valueOf();

  const times = useMemo(() => {
    const newTimes: TimeSlotItem[] = [];
    for (let timer = BEGIN_AT; timer < MINUTES_IN_DAY; timer += minutesStep) {
      const time = StartOfDate.minute(timer);

      newTimes.push({
        date: StartOfDate,
        disabled: unavailableTimeSlots?.some((timeSlot) =>
          time.isBetween(timeSlot.startDate, timeSlot.endDate, 'minute', '[)')
        ),
        height,
        // 'Noon' instead of 12 PM
        time:
          timer === MINUTES_IN_DAY / 2
            ? // TODO: allow this to be configurable
              'Noon'
            : time.format(formatTimeLabel),
      });
    }
    return newTimes;
    // stringDate is being used for StartOfDate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formatTimeLabel,
    height,
    minutesStep,
    startOfDateString,
    unavailableTimeSlots,
  ]);

  return times;
};
