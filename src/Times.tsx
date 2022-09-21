import React from 'react';
import { View, ViewStyle } from 'react-native';

import { CALENDAR_HOUR_HEIGHT, useTimesList } from './utils';

import { useCalendarStyles } from './styles';
import { useCalendarRenderers } from './rendering';

type TimeProps = { style?: ViewStyle; time: string };
const Time: React.FC<TimeProps> = (props) => {
  const { style, time } = props;
  const renderers = useCalendarRenderers();

  return (
    <View style={style}>
      {time === '12 AM' ? null : renderers.timeMarker(time)}
    </View>
  );
};

export const Times: React.FC = () => {
  const styles = useCalendarStyles();

  const times = useTimesList({
    formatTimeLabel: 'h A',
    minutesStep: 60,
  });

  return (
    <View style={styles.columnSmall}>
      {times.map(({ time }, index) => (
        <Time
          key={`${time}-${index}`}
          style={{ height: CALENDAR_HOUR_HEIGHT }}
          time={time}
        />
      ))}
    </View>
  );
};
