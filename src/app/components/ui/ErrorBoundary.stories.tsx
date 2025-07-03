import type { Meta, StoryObj } from '@storybook/nextjs';
import ErrorBoundary from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that throws an error for testing
const ErrorComponent = () => {
  throw new Error('Test error for demonstration');
};

export const WithoutError: Story = {
  args: {
    children: <div className="p-4">This content renders without errors!</div>,
  },
};

export const WithError: Story = {
  args: {
    children: <ErrorComponent />,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ErrorComponent />,
    fallback: (
      <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg text-center">
        <h3 className="text-yellow-800 font-semibold">Custom Error Message</h3>
        <p className="text-yellow-700 text-sm mt-2">Something went wrong, but we handled it gracefully.</p>
      </div>
    ),
  },
};