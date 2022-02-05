import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactMDViewer } from './react-md-viewer';

describe('Simple test', () => {
  test('should render correctly', async () => {
    render(<ReactMDViewer />);

    expect(await screen.findByTestId('react-md-viewer')).toBeInTheDocument();
  });
});
