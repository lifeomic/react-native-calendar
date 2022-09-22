import React, { useEffect } from 'react';
import {
  GestureResponderEvent,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { DayList } from './DayList';
import { Times } from './Times';
import { useEventData } from './utils';

import {
  CalendarColors,
  CalendarStylesProvider,
  useCalendarStyles,
} from './styles';
import { CalendarRenderersProps, CalendarRenderersProvider } from './rendering';

const DEFAULT_MINUTES_STEP = 5;
const MAX_MINUTES_STEP = 60;

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
};

export type CalendarProps = {
  /**
   * The list of events to render on the calendar.
   */
  events: CalendarEvent[];
  /**
   * Number of minutes per clickable time slot interval
   *
   * Example:
   * 5 = 5 minutes per step so 12 intervals within an hour
   * 15 = 15 minutes per step so 5 intervals within an hour
   *
   * minimum: 5
   * maximum: 60
   * default: 5
   */
  minutesStep?: number;
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
   * In multi-day mode, this specifies the week that will be displayed.
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
   * The height of the "hour" sections in the day view.
   */
  hourHeight?: number;
  /**
   * Style Prop for the Calendar ScrollView. If the Calendar does not have a
   * parent container with a fixed height, use this prop to ensure that the
   * Calendar does not inflate outside of the useable view
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Time slots to mark as "disabled".
   */
  unavailableTimeSlots?: TimeSlot[];
};

const Calendar: React.FC<CalendarProps> = (props) => {
  const {
    events,
    minutesStep = DEFAULT_MINUTES_STEP,
    numDays,
    onEventPress,
    onGridPress,
    startDate,
    startHour = 8,
    hourHeight = 60,
    style,
    unavailableTimeSlots,
  } = props;
  const scrollViewRef = React.useRef<ScrollView>(null);

  const eventData = useEventData({
    events,
    numDays,
    startDate,
    unavailableTimeSlots,
  });

  const styles = useCalendarStyles();

  /**
   * it's important that the scrollView scrollTo is called after the initial
   * rendering of ScrollView instead of within the onLayout as the inner
   * components will not be drawn and inflated at that time. So even tho the
   * values we need will be present at that time, the scrollTo will be
   * called and have no where to scroll so the scrollTo will result in the
   * view staying at the top of the ScrollView
   */
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      animated: false,
      /**
       * size of hours before start hour + fontSize + startHour
       * for all the { height: 1 } separators
       */
      y: hourHeight * (startHour - 1) + 10 + startHour,
    });
  }, [scrollViewRef.current]);

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={style}
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
            minutesStep={
              minutesStep < DEFAULT_MINUTES_STEP
                ? DEFAULT_MINUTES_STEP
                : minutesStep > MAX_MINUTES_STEP
                ? MAX_MINUTES_STEP
                : minutesStep
            }
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
> = ({ colors, renderers, ...props }) => {
  return (
    <CalendarStylesProvider colors={colors}>
      <CalendarRenderersProvider renderers={renderers}>
        <Calendar {...props} />
      </CalendarRenderersProvider>
    </CalendarStylesProvider>
  );
};

export { WithContextProps as Calendar };
