/// <reference types="vitest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import Carousel from '../app/components/carousel';
import { vi } from 'vitest';

// mock next/image to a simple img for tests
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width, height, ...rest } = props;
    return React.createElement('img', rest);
  },
}));

// mock next/navigation useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Carousel', () => {
  it('renders movie items', () => {
    const movies = [
      { id: 1, title: 'One', poster_path: '/a.jpg', release_date: '2020-01-01' },
      { id: 2, title: 'Two', poster_path: '/b.jpg', release_date: '2021-01-01' },
    ];

    render(<Carousel movies={movies as any} />);

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
