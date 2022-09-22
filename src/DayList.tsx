import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import type { CalendarProps } from './Calendar';
import { Separator } from './Separator';
import { TimeSlot } from './TimeSlot';
import { useTimesList } from './utils';

import { useCalendarStyles } from './styles';
import { useCalendarRenderers } from './rendering';

const getStepsInHour = (minutesStep: number) => 60 / minutesStep;

type DayListProps = Pick<
  CalendarProps,
  'events' | 'onEventPress' | 'onGridPress' | 'unavailableTimeSlots'
> &
  Required<Pick<CalendarProps, 'minutesStep'>> & {
    date: dayjs.Dayjs;
    hourHeight: number;
  };

export const DayList: React.FC<DayListProps> = (props) => {
  const {
    events,
    date,
    hourHeight,
    minutesStep,
    onEventPress,
    onGridPress,
    unavailableTimeSlots,
  } = props;

  const stepsInHours = getStepsInHour(minutesStep);

  const styles = useCalendarStyles();
  const times = useTimesList({
    date,
    formatTimeLabel: 'h:mm A',
    height: hourHeight / stepsInHours,
    minutesStep,
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
            !time.time.includes(
              // if the minutesStep is > 50 we'll get :09 -> :00
              `:${minutesStep > 50 ? '0' : ''}${60 - minutesStep}`
            ) ? null : (
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
                    (difference / minutesStep) * (hourHeight / stepsInHours),
                  /**
                   * startHour * (hourHeight + 1)
                   * each hour has a fixed height and each Separator has a height
                   * of 1 which adds up based on the start time hour. add together
                   * to get the start location of the hour mark
                   *
                   * startMinute / 15 => :00 = 0, :15 = 1, :30 = 2, :45 = 3
                   * hourHeight / 4 => size of the 15 minute interval segments
                   * combine them together to get the start position of the event
                   * within the hour based on minutes
                   *
                   * add all of these together to get the event start position
                   */
                  top:
                    startHour * (hourHeight + 1) +
                    (startMinute / minutesStep) * (hourHeight / stepsInHours),
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
