import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import type { CalendarProps } from './Calendar';
import { Separator } from './Separator';
import { TimeSlot } from './TimeSlot';
import { useTimesList } from './utils';

import { useCalendarStyles } from './styles';
import { useCalendarRenderers } from './rendering';

const DEFAULT_MINUTES_STEP = 5;
const STEPS_IN_HOUR = 60 / DEFAULT_MINUTES_STEP;

type DayListProps = Pick<
  CalendarProps,
  'events' | 'onEventPress' | 'onGridPress' | 'unavailableTimeSlots'
> & {
  date: dayjs.Dayjs;
  hourHeight: number;
};

export const DayList: React.FC<DayListProps> = (props) => {
  const {
    events,
    date,
    hourHeight,
    onEventPress,
    onGridPress,
    unavailableTimeSlots,
  } = props;

  const styles = useCalendarStyles();
  const times = useTimesList({
    date,
    formatTimeLabel: 'h:mm A',
    height: hourHeight / STEPS_IN_HOUR,
    minutesStep: DEFAULT_MINUTES_STEP,
    unavailableTimeSlots,
  });

  const renderers = useCalendarRenderers();

  return (
    <View style={styles.flex}>
      {times.map((time, index) => {
        const key = `${time.time}-${index}`;

        return (
          <View key={key}>
            <TimeSlot onGridPress={onGridPress} time={time} />
            {index === 0 ||
            index === times.length - 1 ||
            !time.time.includes(':55') ? null : (
              <Separator />
            )}
          </View>
        );
      })}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {events.map((event, index) => {
          const eventStartDay = dayjs(event.startDate);
          const eventEndDay = dayjs(event.endDate);
          const startHour = eventStartDay.hour();
          const startMinute = eventStartDay.minute();
          const difference = eventEndDay.diff(eventStartDay, 'minute');

          return (
            <Pressable
              key={`${event.id}-${index}`}
              testID={`calendar-event-${event.id}`}
              onPress={() => onEventPress?.(event)}
              style={[
                styles.event,
                {
                  height:
                    (difference / DEFAULT_MINUTES_STEP) *
                    (hourHeight / STEPS_IN_HOUR),
                  /**
                   * startHour * (hourHeight + 1)
                   * each hour has a fixed height and each Separator has a height
                   * of 1 which adds up based on the start time hour. add together
                   * to get the start location of the hour mark
                   *
                   * startMinute / 5 => :00 = 0, :05 = 1, :10 = 2, ... :55 = 11
                   * hourHeight / 4 => size of the 15 minute interval segments
                   * combine them together to get the start position of the event
                   * within the hour based on minutes
                   *
                   * add all of these together to get the event start position
                   */
                  top:
                    startHour * (hourHeight + 1) +
                    (startMinute / DEFAULT_MINUTES_STEP) *
                      (hourHeight / STEPS_IN_HOUR),
                },
                event.color ? { backgroundColor: event.color } : undefined,
              ]}
            >
              {renderers.eventContent(event)}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
