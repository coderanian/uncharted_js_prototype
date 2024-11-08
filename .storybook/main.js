const config = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook'
    ],

    framework: '@storybook/react-webpack5',

    docs: {
        autodocs: true
    }
};

export default config;