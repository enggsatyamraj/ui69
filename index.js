module.exports = {
    name: 'ui69',
    description: 'Unstyled, accessible UI components for React Native',
    version: require('./package.json').version,

    // Export components for direct import if needed
    Button: require('./components/ui/button/button').Button,
    Skeleton: require('./components/ui/skeleton').Skeleton,
    Seperator: require('./components/ui/seperator').Separator,
    Card: require('./components/ui/card').Card,
    CardHeader: require('./components/ui/card').CardHeader,
    CardContent: require('./components/ui/card').CardContent,
    CardFooter: require('./components/ui/card').CardFooter,
    Badge: require('./components/ui/badge').Badge,
    DotBadge: require('./components/ui/badge').DotBadge,
    Avatar: require('./components/ui/avatar').Avatar,
    AvatarGroup: require('./components/ui/avatar').AvatarGroup,
    Accordion: require('./components/ui/accordion').Accordion,
    AccordionItem: require('./components/ui/accordion').AccordionItem,
    AccordionTrigger: require('./components/ui/accordion').AccordionTrigger,
    AccordionContent: require('./components/ui/accordion').AccordionContent,
};