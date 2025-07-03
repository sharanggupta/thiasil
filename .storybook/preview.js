import '../src/app/globals.css';

/** @type { import('@storybook/nextjs').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
        {
          name: 'thiasil',
          value: '#f7f7f7',
        },
      ],
    },
  },
};

export default preview;