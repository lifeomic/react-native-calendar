import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import { CalendarEvent } from './Calendar';
// TODO: remove this line when we migrate to external package
// eslint-disable-next-line no-restricted-imports
import { Text } from 'react-native';
import dayjs from 'dayjs';
import { useCalendarStyles } from './styles';

export type CalendarRenderers = {
  /**
   * A render function for the content of a particular event.
   *
   * @param event The event to render.
   */
  eventContent: (event: CalendarEvent) => React.ReactNode;
  /**
   * A render function for individual time markers on the left side of the
   * calendar.
   *
   * **IMPORTANT**: small margin adjusting may be required to vertically center
   * the times correctly.
   *
   * @param time The formatted time string to render.
   */
  timeMarker: (time: string) => React.ReactNode;
};

export type CalendarRenderersProps = {
  /**
   * Rendering overrides to use within the calendar.
   *
   * **IMPORTANT**: These rendering functions should be referentially
   * stable, ideally by being statically defined. e.g.
   *
   * @example
   *
   * const renderEventContent = () => <>{...}</>
   *
   * const MyComponent = () => {
   *   <Calendar
   *     renderers={{ eventContent: renderEventContent }}
   *   />
   * }
   */
  renderers?: CalendarRenderers;
};

const DEFAULT_RENDERERS: CalendarRenderers = {
  eventContent: (event) => (
    <>
      <Text>{event.title}</Text>
      <Text>
        {`${dayjs(event.startDate).format('h:mm')} - ${dayjs(
          event.endDate
        ).format('h:mm')}`}
      </Text>
    </>
  ),
  timeMarker: (time) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const styles = useCalendarStyles();
    return <Text style={styles.font}>{time}</Text>;
  },
};

const CalendarRenderersContext =
  React.createContext<CalendarRenderers>(DEFAULT_RENDERERS);

export type CalendarRenderersProviderProps = {
  children?: React.ReactNode;
  renderers?: CalendarRenderers;
};

export const CalendarRenderersProvider: React.FC<
  CalendarRenderersProviderProps
> = ({ children, renderers }) => {
  const value = useMemo(
    () => merge(DEFAULT_RENDERERS, renderers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(renderers ?? {})]
  );

  return (
    <CalendarRenderersContext.Provider value={value}>
      {children}
    </CalendarRenderersContext.Provider>
  );
};

export const useCalendarRenderers = (): CalendarRenderers => {
  return React.useContext(CalendarRenderersContext);
};
