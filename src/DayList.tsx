import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import type { CalendarProps } from './Calendar';
import { Separator } from './Separator';
import { TimeSlot } from './TimeSlot';
import { useTimesList } from './utils';

import { useCalendarStyles } from './styles';
import { useCalendarRenderers } from './rendering';

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
    height: hourHeight / 4,
    minutesStep: 15,
    unavailableTimeSlots,
  });

  const renderers = useCalendarRenderers();

  if (!hourHeight) {
    return null;
  }

  return (
    <View style={styles.flex}>
      {times.map((time, index) => {
        const key = `${time.time}-${index}`;

        return (
          <View key={key}>
            <TimeSlot onGridPress={onGridPress} time={time} />
            {index === 0 ||
            index === times.length - 1 ||
            !time.time.includes(':45') ? null : (
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
          const difference = eventEndDay.diff(eventStartDay, 'minute');

          return (
            <Pressable
              key={`${event.id}-${index}`}
              onPress={() => onEventPress?.(event)}
              style={[
                styles.event,
                {
                  height: (difference / 15) * (hourHeight / 4),
                  top: startHour * hourHeight + startHour,
                },
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