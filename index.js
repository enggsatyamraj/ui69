module.exports = {
    name: 'rajsatyam',
    description: 'Unstyled, accessible UI components for React Native',
    version: require('./package.json').version,

    // Export components for direct import if needed
    Button: require('./components/ui/button/button').Button,
    Skeleton: require('./components/ui/skeleton').Skeleton,
};