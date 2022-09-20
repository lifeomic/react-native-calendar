import * as React from 'react';
import { View } from 'react-native';

import { useCalendarStyles } from './styles';

const Separator: React.FC = () => {
  const styles = useCalendarStyles();
  return <View style={styles.separator} />;
};

const MemoizedSeparator = React.memo(Separator);

export { MemoizedSeparator as Separator };
