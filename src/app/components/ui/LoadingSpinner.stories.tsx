import type { Meta, StoryObj } from '@storybook/nextjs';
import LoadingSpinner from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};