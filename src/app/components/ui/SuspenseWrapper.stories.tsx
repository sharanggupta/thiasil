import type { Meta, StoryObj } from '@storybook/nextjs';
import SuspenseWrapper from './SuspenseWrapper';
import { Suspense } from 'react';

const meta: Meta<typeof SuspenseWrapper> = {
  title: 'UI/SuspenseWrapper',
  component: SuspenseWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that simulates loading
const DelayedComponent = ({ delay = 2000 }: { delay?: number }) => {
  throw new Promise(resolve => setTimeout(resolve, delay));
};

export const Default: Story = {
  args: {
    children: <div>Content loaded successfully!</div>,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <div>Content loaded successfully!</div>,
    fallback: <div className="p-4 text-center">Custom loading message...</div>,
  },
};

export const WithClassName: Story = {
  args: {
    children: <div>Content loaded successfully!</div>,
    className: 'bg-gray-100 rounded-lg',
  },
};