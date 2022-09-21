import React from 'react';
import { StyleSheet } from 'react-native';
import merge from 'lodash/merge';

export type CalendarColors = {
  /**
   * The background color of the left and right outside columns of the calendar.
   */
  outsideColumns: string;
  /**
   * The background color of calendar sections that are disabled.
   */
  disabledCalendarBackground: string;
  /**
   * The background color of calendar sections that are not disabled.
   */
  enabledCalendarBackground: string;
  /**
   * The color of the separator line in the calendar.
   */
  separator: string;
  /**
   * A default color for events. This can be overriden per-event
   * in the CalendarEvent object.
   */
  event: string;
};

const DEFAULT_COLORS: CalendarColors = {
  disabledCalendarBackground: 'lightgray',
  enabledCalendarBackground: 'white',
  outsideColumns: 'white',
  event: 'lightblue',
  separator: 'gray',
};

type InternalCalendarStylesContextValue = {
  colors: CalendarColors;
};

/**
 * Wee use Context here because it allows us to reliably create a _single_
 * stylesheet instance that is used throughout the calendar.
 */
const CalendarStylesContext =
  React.createContext<InternalCalendarStylesContextValue>({
    colors: DEFAULT_COLORS,
  });

export type CalendarStylesProviderProps = {
  children?: React.ReactNode;
  colors?: Partial<CalendarColors>;
};

export const CalendarStylesProvider: React.FC<CalendarStylesProviderProps> = ({
  children,
  colors = {},
}) => {
  const value = React.useMemo(
    () => ({ colors: merge(DEFAULT_COLORS, colors) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(colors)]
  );

  return (
    <CalendarStylesContext.Provider value={value}>
      {children}
    </CalendarStylesContext.Provider>
  );
};

export const useCalendarStyles = () => {
  const { colors } = React.useContext(CalendarStylesContext);

  return React.useMemo(
    () => {
      // eslint-disable-next-line no-restricted-properties
      return StyleSheet.create({
        columnBig: {
          backgroundColor: colors.enabledCalendarBackground,
          flexDirection: 'row',
          height: '100%',
          width: '75%',
        },
        columnSmall: {
          backgroundColor: colors.outsideColumns,
          height: '100%',
          width: '12.5%',
        },
        container: {
          flexDirection: 'row',
        },
        event: {
          backgroundColor: colors.event,
          position: 'absolute',
          width: '100%',
        },
        separator: {
          backgroundColor: colors.separator,
          height: StyleSheet.hairlineWidth,
        },
        font: {
          marginTop: -6, // 1 from time height style and 5 from half the fontSize
          paddingRight: 10,
          textAlign: 'right',
        },
        flex: {
          flex: 1,
        },
        enabled: {
          backgroundColor: colors.enabledCalendarBackground,
        },
        disabled: {
          backgroundColor: colors.disabledCalendarBackground,
        },
      });
    },
    // Assume theme is static aside from dark/light
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};
