import React from 'react';
import { View, ViewStyle } from 'react-native';

import { useTimesList } from './utils';

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

export type TimesProps = {
  hourHeight: number;
};

export const Times: React.FC<TimesProps> = (props) => {
  const { hourHeight } = props;
  const styles = useCalendarStyles();

  const times = useTimesList({
    formatTimeLabel: 'h A',
    height: hourHeight + 1,
    minutesStep: 60,
  });

  return (
    <View style={styles.columnSmall}>
      {times.map(({ height, time }, index) => (
        <Time key={`${time}-${index}`} style={{ height }} time={time} />
      ))}
    </View>
  );
};
