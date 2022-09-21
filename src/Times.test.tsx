import React from 'react';
import { render } from '@testing-library/react-native';
import { Times } from './Times';

describe('Times', () => {
  it('renders Times with the correct time slot', () => {
    const view = render(<Times />);

    expect(view.queryByText('12 AM')).toBeFalsy();
    expect(view.queryByText('1 AM')).toBeTruthy();
    expect(view.queryByText('2 AM')).toBeTruthy();
    expect(view.queryByText('3 AM')).toBeTruthy();
    expect(view.queryByText('4 AM')).toBeTruthy();
    expect(view.queryByText('5 AM')).toBeTruthy();
    expect(view.queryByText('6 AM')).toBeTruthy();
    expect(view.queryByText('7 AM')).toBeTruthy();
    expect(view.queryByText('8 AM')).toBeTruthy();
    expect(view.queryByText('9 AM')).toBeTruthy();
    expect(view.queryByText('10 AM')).toBeTruthy();
    expect(view.queryByText('11 AM')).toBeTruthy();
    expect(view.queryByText('12 PM')).toBeFalsy();
    expect(view.queryByText('Noon')).toBeTruthy();
    expect(view.queryByText('1 PM')).toBeTruthy();
    expect(view.queryByText('2 PM')).toBeTruthy();
    expect(view.queryByText('3 PM')).toBeTruthy();
    expect(view.queryByText('4 PM')).toBeTruthy();
    expect(view.queryByText('5 PM')).toBeTruthy();
    expect(view.queryByText('6 PM')).toBeTruthy();
    expect(view.queryByText('7 PM')).toBeTruthy();
    expect(view.queryByText('8 PM')).toBeTruthy();
    expect(view.queryByText('9 PM')).toBeTruthy();
    expect(view.queryByText('10 PM')).toBeTruthy();
    expect(view.queryByText('11 PM')).toBeTruthy();
  });
});
