import React from 'react';
import { GestureResponderEvent, ScrollView, View } from 'react-native';

import { DayList } from './DayList';
import { Times } from './Times';
import { useEventData } from './utils';

import {
  CalendarColors,
  CalendarStylesProvider,
  useCalendarStyles,
} from './styles';
import { CalendarRenderersProps, CalendarRenderersProvider } from './rendering';

export type TimeSlot = {
  startDate: Date;
  endDate: Date;
};

export type CalendarEvent = TimeSlot & {
  color?: string;
  id: string;
  title: string;
};

export type CalendarStylesProps = {
  /** Color overrides to use within the calendar. */
  colors?: Partial<CalendarColors>;
  /** A spacing function to use within the calendar. */
  spacing?: (unit: number) => number;
};

export type CalendarProps = {
  /**
   * The list of events to render on the calendar.
   */
  events: CalendarEvent[];
  /**
   * 1 = Day view
   * 7 = Week view TODO: the Calendar UI is not designed optimally yet for week usage
   */
  numDays: 1 | 7;
  /**
   * Called when an event is pressed.
   */
  onEventPress?: (event: CalendarEvent) => void;
  /**
   * Called when an empty space on the calendar is pressed. The provided
   * `date` represents the rough date that the user pressed.
   *
   * The `date` will be rounded to a 15-minute interval.
   */
  onGridPress?: (pressEvent: GestureResponderEvent, date: Date) => void;
  /**
   * The start date from which to begin the calendar.
   *
   * In multi-day mode, this specifies the first day that will be displayed.
   *
   * In single-day mode, this specifies the day that will be shown.
   */
  startDate: Date;
  /**
   * Vertical start position of the view based on 24 hour time
   *
   * Default value: 8 (8 am)
   */
  startHour?: number;
  /**
   * Time slots to mark as "disabled".
   */
  unavailableTimeSlots?: TimeSlot[];
};

const Calendar: React.FC<CalendarProps> = (props) => {
  const {
    events,
    numDays,
    onEventPress,
    onGridPress,
    startDate,
    startHour = 8,
    unavailableTimeSlots,
  } = props;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [hourHeight, setHourHeight] = React.useState(0);

  const eventData = useEventData({
    events,
    numDays,
    startDate,
    unavailableTimeSlots,
  });

  const styles = useCalendarStyles();

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles.container}
      onLayout={(event) => {
        const itemHeight = event.nativeEvent.layout.height / 11;
        const roundedUpHeight = Math.ceil(itemHeight / 10) * 10;
        scrollViewRef.current?.scrollTo({
          animated: false,
          y: roundedUpHeight * (startHour - 0.75),
        });
        setHourHeight(roundedUpHeight);
      }}
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={styles.flex}
      testID="calendar"
    >
      <Times hourHeight={hourHeight} />
      <View style={styles.columnBig}>
        {eventData.map((data) => (
          <DayList
            date={data.date}
            events={data.events}
            hourHeight={hourHeight}
            key={data.date.valueOf()}
            onEventPress={onEventPress}
            onGridPress={onGridPress}
            unavailableTimeSlots={data.unavailableTimeSlots}
          />
        ))}
      </View>
      <View style={styles.columnSmall} />
    </ScrollView>
  );
};

const WithContextProps: React.FC<
  CalendarProps & CalendarStylesProps & CalendarRenderersProps
> = ({ colors, spacing, renderers, ...props }) => {
  return (
    <CalendarStylesProvider colors={colors} spacing={spacing}>
      <CalendarRenderersProvider renderers={renderers}>
        <Calendar {...props} />
      </CalendarRenderersProvider>
    </CalendarStylesProvider>
  );
};

export { WithContextProps as Calendar };
