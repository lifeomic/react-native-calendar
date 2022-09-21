import React from 'react';
import { Pressable } from 'react-native';

import type { CalendarProps } from './Calendar';
import { useCalendarStyles } from './styles';
import type { TimeSlotItem } from './utils';

type TimeSlotProps = Pick<CalendarProps, 'onGridPress'> & {
  time: TimeSlotItem;
};

export const TimeSlot: React.FC<TimeSlotProps> = (props) => {
  const { onGridPress, time } = props;
  const styles = useCalendarStyles();

  return (
    <Pressable
      disabled={time.disabled}
      {...(onGridPress
        ? {
            onPress: (event) => {
              // create date object based on the date for the time slot and the time for the slot
              if (time.time === 'Noon') {
                onGridPress(event, time.date.hour(12).toDate());
              } else {
                // time.time format = `Hour:Minute(s) AM|PM`
                const [timeString, meridiem] = time.time.split(' ');
                const [hour, minute] = timeString
                  .split(':')
                  .map((hourOrMinuteString) =>
                    parseInt(hourOrMinuteString, 10)
                  );
                const base24Hour = (hour % 12) + (meridiem === 'PM' ? 12 : 0);
                const date = time.date.hour(base24Hour).minute(minute);
                onGridPress(event, date.toDate());
              }
            },
          }
        : {})}
      style={[
        time.disabled ? styles.disabled : styles.enabled,
        { height: time.height },
      ]}
      testID="time slot"
    />
  );
};
