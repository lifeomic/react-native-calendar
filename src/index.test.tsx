import React from 'react';
import { render } from '@testing-library/react-native';
import { PlaceholderComponent } from '.';

test('PlaceholderComponent', () => {
  const screen = render(<PlaceholderComponent />);
  expect(screen.queryByText('PLACEHOLDER')).not.toBeNull();
});
