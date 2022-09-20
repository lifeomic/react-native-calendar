import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { merge } from 'lodash';

export type CalendarColors = {
  outsideColumns: string;
  disabledCalendarBackground: string;
  enabledCalendarBackground: string;
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
  outsideColumns: 'gray',
  event: 'blue',
  separator: 'lightgray',
};

const DEFAULT_SPACING = (unit: number) => unit * 8;

type InternalCalendarStylesContextValue = {
  colors: CalendarColors;
  spacing: (unit: number) => number;
};

/**
 * Wee use Context here because it allows us to reliably create a _single_
 * stylesheet instance that is used throughout the calendar.
 */
const CalendarStylesContext =
  React.createContext<InternalCalendarStylesContextValue>({
    colors: DEFAULT_COLORS,
    spacing: DEFAULT_SPACING,
  });

export type CalendarStylesProviderProps = {
  children?: React.ReactNode;
  colors?: Partial<CalendarColors>;
  spacing?: (unit: number) => number;
};

export const CalendarStylesProvider: React.FC<CalendarStylesProviderProps> = ({
  children,
  colors = {},
  spacing,
}) => {
  const value = useMemo(
    () => ({
      colors: merge(DEFAULT_COLORS, colors),
      spacing: spacing ?? DEFAULT_SPACING,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(colors), spacing]
  );

  return (
    <CalendarStylesContext.Provider value={value}>
      {children}
    </CalendarStylesContext.Provider>
  );
};

export const useCalendarStyles = () => {
  const { colors, spacing } = React.useContext(CalendarStylesContext);

  return useMemo(
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
          justifyContent: 'center',
          paddingLeft: spacing(1),
          position: 'absolute',
          width: '100%',
        },
        separator: {
          backgroundColor: colors.separator,
          height: StyleSheet.hairlineWidth,
        },
        font: {
          marginTop: -6, // 1 from time height style and 5 from half the fontSize
          paddingRight: spacing(2),
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