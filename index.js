module.exports = {
    name: 'ui69',
    description: 'Unstyled, accessible UI components for React Native',
    version: require('./package.json').version,

    // Export components for direct import if needed
    Button: require('./components/ui/button').Button,

    // Checkbox exports
    Checkbox: require('./components/ui/checkbox').Checkbox,
    CheckboxGroup: require('./components/ui/checkbox').CheckboxGroup,
    checkboxVariants: require('./components/ui/checkbox').checkboxVariants,

    // Radio exports
    Radio: require('./components/ui/radio').Radio,
    RadioGroup: require('./components/ui/radio').RadioGroup,
    radioVariants: require('./components/ui/radio').radioVariants,

    // Switch exports
    Switch: require('./components/ui/switch').Switch,
    SwitchGroup: require('./components/ui/switch').SwitchGroup,
    switchVariants: require('./components/ui/switch').switchVariants,

    Input: require('./components/ui/input').Input,
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
    InputOTP: require('./components/ui/input-otp').InputOTP,
    InputOTPGroup: require('./components/ui/input-otp').InputOTPGroup,
    InputOTPSeparator: require('./components/ui/input-otp').InputOTPSeparator,
    InputOTPSlot: require('./components/ui/input-otp').InputOTPSlot,
    PATTERNS: require('./components/ui/input-otp').PATTERNS,

    // Toast exports
    ToastProvider: require('./components/ui/toast').ToastProvider,
    useToast: require('./components/ui/toast').useToast,
    useToastController: require('./components/ui/toast').useToastController,
    toastVariants: require('./components/ui/toast').toastVariants,

    // Select exports
    Select: require('./components/ui/select').Select,
    SelectContent: require('./components/ui/select').SelectContent,
    SelectGroup: require('./components/ui/select').SelectGroup,
    SelectItem: require('./components/ui/select').SelectItem,
    SelectLabel: require('./components/ui/select').SelectLabel,
    SelectSeparator: require('./components/ui/select').SelectSeparator,
    SelectTrigger: require('./components/ui/select').SelectTrigger,
    SelectValue: require('./components/ui/select').SelectValue,

    // Drawer exports
    Drawer: require('./components/ui/drawer').Drawer,
    DrawerTrigger: require('./components/ui/drawer').DrawerTrigger,
    DrawerContent: require('./components/ui/drawer').DrawerContent,
    DrawerHeader: require('./components/ui/drawer').DrawerHeader,
    DrawerTitle: require('./components/ui/drawer').DrawerTitle,
    DrawerDescription: require('./components/ui/drawer').DrawerDescription,
    DrawerFooter: require('./components/ui/drawer').DrawerFooter,
    DrawerClose: require('./components/ui/drawer').DrawerClose,
    drawerVariants: require('./components/ui/drawer').drawerVariants,
};