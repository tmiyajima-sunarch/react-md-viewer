import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReactMdViewer from './react-md-viewer';

describe('Simple test', () => {
  test('should render correctly', async () => {
    render(<ReactMdViewer />);

    expect(await screen.findByTestId('react-md-viewer')).toBeInTheDocument();
  });
});
