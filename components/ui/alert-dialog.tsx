import { LinearGradient } from 'expo-linear-gradient';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// AlertDialog variants using theme colors
const alertDialogVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.card,
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            borderColor: currentTheme.border,
            titleColor: currentTheme.cardForeground,
            descriptionColor: currentTheme.mutedForeground,
        },
        destructive: {
            backgroundColor: currentTheme.card,
            overlayColor: 'rgba(239, 68, 68, 0.1)', // Red tint
            borderColor: currentTheme.destructive,
            titleColor: currentTheme.destructive,
            descriptionColor: currentTheme.mutedForeground,
        },
        warning: {
            backgroundColor: currentTheme.card,
            overlayColor: 'rgba(245, 158, 11, 0.1)', // Yellow tint
            borderColor: '#f59e0b',
            titleColor: '#d97706',
            descriptionColor: currentTheme.mutedForeground,
        },
    },
    size: {
        sm: {
            maxWidth: 300,
            padding: 16,
            titleFontSize: 16,
            descriptionFontSize: 13,
            borderRadius: radius.md,
        },
        md: {
            maxWidth: 400,
            padding: 24,
            titleFontSize: 18,
            descriptionFontSize: 14,
            borderRadius: radius.lg,
        },
        lg: {
            maxWidth: 500,
            padding: 32,
            titleFontSize: 20,
            descriptionFontSize: 16,
            borderRadius: radius.xl,
        },
    },
};

// Types
interface AlertDialogContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    variant: keyof typeof alertDialogVariants.variant;
    size: keyof typeof alertDialogVariants.size;
    onOpenChange?: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

// Hook to use alert dialog context
const useAlertDialog = () => {
    const context = useContext(AlertDialogContext);
    if (!context) {
        throw new Error('useAlertDialog must be used within an AlertDialog component');
    }
    return context;
};

// Main AlertDialog component (Root)
export interface AlertDialogProps {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: keyof typeof alertDialogVariants.variant;
    size?: keyof typeof alertDialogVariants.size;
}

export function AlertDialog({
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    variant = 'default',
    size = 'md',
}: AlertDialogProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Controlled vs uncontrolled handling
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (open: boolean) => {
        if (!isControlled) {
            setInternalOpen(open);
        }
        onOpenChange?.(open);
    };

    const value: AlertDialogContextType = {
        isOpen,
        setIsOpen: handleOpenChange,
        variant,
        size,
        onOpenChange,
    };

    return (
        <AlertDialogContext.Provider value={value}>
            {children}
        </AlertDialogContext.Provider>
    );
}

// AlertDialogTrigger component
export interface AlertDialogTriggerProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function AlertDialogTrigger({
    children,
    asChild = false,
    style,
}: AlertDialogTriggerProps) {
    const { setIsOpen } = useAlertDialog();

    const handlePress = () => {
        setIsOpen(true);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            // @ts-ignore
            onPress: handlePress,
            // @ts-ignore
            style: [children.props.style, style],
        });
    }

    return (
        <Pressable onPress={handlePress} style={style}>
            {children}
        </Pressable>
    );
}

// AlertDialogPortal component - Using Modal for proper overlay
export interface AlertDialogPortalProps {
    children: React.ReactNode;
}

export function AlertDialogPortal({ children }: AlertDialogPortalProps) {
    const { isOpen } = useAlertDialog();

    return (
        <Modal
            transparent={true}
            visible={isOpen}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={() => { }} // Prevent dismissing with back button
        >
            {children}
        </Modal>
    );
}

// AlertDialogOverlay component
export interface AlertDialogOverlayProps {
    style?: StyleProp<ViewStyle>;
    dismissible?: boolean;
}

export function AlertDialogOverlay({
    style,
    dismissible = false
}: AlertDialogOverlayProps) {
    const { isOpen, setIsOpen, variant } = useAlertDialog();
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const variantStyle = alertDialogVariants.variant[variant];

    useEffect(() => {
        Animated.timing(overlayOpacity, {
            toValue: isOpen ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const handlePress = () => {
        if (dismissible) {
            setIsOpen(false);
        }
    };

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    backgroundColor: variantStyle.overlayColor,
                    opacity: overlayOpacity,
                },
                style,
            ]}
            pointerEvents={isOpen ? 'auto' : 'none'}
        >
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>
        </Animated.View>
    );
}

// AlertDialogContent component
export interface AlertDialogContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    dismissible?: boolean;
    scrollable?: boolean; // New prop to enable scrolling
    maxHeight?: number; // Custom max height
    showScrollIndicator?: boolean; // Show visual scroll hints
}

export function AlertDialogContent({
    children,
    style,
    dismissible = false,
    scrollable = true, // Default to true for better UX
    maxHeight,
    showScrollIndicator = true, // Default to true for better UX
}: AlertDialogContentProps) {
    const { isOpen, setIsOpen, variant, size } = useAlertDialog();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const topFadeAnim = useRef(new Animated.Value(0)).current;
    const bottomFadeAnim = useRef(new Animated.Value(0)).current;

    // Scroll state
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    const variantStyle = alertDialogVariants.variant[variant];
    const sizeStyle = alertDialogVariants.size[size];

    // Handle hardware back button on Android
    useEffect(() => {
        if (Platform.OS === 'android' && isOpen) {
            const handleBackPress = () => {
                if (dismissible) {
                    setIsOpen(false);
                    return true;
                }
                return true; // Prevent back navigation even if not dismissible
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => subscription.remove();
        }
    }, [isOpen, dismissible, setIsOpen]);

    // Animation effects
    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 12,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [isOpen, scaleAnim, opacityAnim]);

    // Animate fade indicators
    useEffect(() => {
        Animated.timing(topFadeAnim, {
            toValue: canScrollUp ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [canScrollUp]);

    useEffect(() => {
        Animated.timing(bottomFadeAnim, {
            toValue: canScrollDown ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [canScrollDown]);

    // Check if content can scroll
    const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
        setContentHeight(contentHeight);
        updateScrollIndicators(0, contentHeight, scrollViewHeight);
    };

    const handleScrollViewLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setScrollViewHeight(height);
        updateScrollIndicators(0, contentHeight, height);
    };

    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        updateScrollIndicators(contentOffset.y, contentSize.height, layoutMeasurement.height);
    };

    const updateScrollIndicators = (scrollY: number, contentHeight: number, viewHeight: number) => {
        if (!scrollable || !showScrollIndicator) {
            setCanScrollUp(false);
            setCanScrollDown(false);
            return;
        }

        // Only show indicators if content actually overflows
        const hasOverflow = contentHeight > viewHeight;

        if (!hasOverflow) {
            setCanScrollUp(false);
            setCanScrollDown(false);
            return;
        }

        const canScrollUp = scrollY > 10; // Small threshold
        const canScrollDown = scrollY < contentHeight - viewHeight - 10; // Small threshold

        setCanScrollUp(canScrollUp);
        setCanScrollDown(canScrollDown);
    };

    if (!isOpen) return null;

    // Calculate available height for the dialog
    const screenHeight = Platform.OS === 'web' ? window.innerHeight : Dimensions.get('window').height;
    const availableHeight = screenHeight - (insets.top + insets.bottom + 80); // 80px total margin
    const dialogMaxHeight = maxHeight || availableHeight * 0.9; // Use 90% of available height

    const contentStyle = {
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
        borderWidth: 1,
        borderRadius: sizeStyle.borderRadius,
        maxWidth: sizeStyle.maxWidth,
        width: '100%',
        maxHeight: dialogMaxHeight,
    };

    const ContentWrapper = scrollable ? ScrollView : View;
    const contentWrapperProps = scrollable ? {
        ref: scrollViewRef,
        showsVerticalScrollIndicator: false, // Hide native indicator since we have fades
        bounces: false,
        contentContainerStyle: {
            padding: sizeStyle.padding,
        },
        style: { flexShrink: 1 },
        onContentSizeChange: handleContentSizeChange,
        onLayout: handleScrollViewLayout,
        onScroll: handleScroll,
        scrollEventThrottle: 16,
    } : {
        style: {
            padding: sizeStyle.padding,
            flexShrink: 1,
        }
    };

    return (
        <View style={styles.contentContainer}>
            <Animated.View
                style={[
                    styles.content,
                    // @ts-ignore
                    contentStyle,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                    style,
                ]}
            >
                <ContentWrapper {...contentWrapperProps}>
                    {children}
                </ContentWrapper>

                {/* Top fade indicator - only show when content overflows AND can scroll up */}
                {scrollable && showScrollIndicator && canScrollUp && (
                    <Animated.View
                        style={[
                            styles.fadeIndicator,
                            styles.fadeIndicatorTop,
                            {
                                opacity: topFadeAnim,
                                borderTopLeftRadius: sizeStyle.borderRadius,
                                borderTopRightRadius: sizeStyle.borderRadius,
                            }
                        ]}
                        pointerEvents="none"
                    >
                        <LinearGradient
                            colors={[
                                variantStyle.backgroundColor,
                                variantStyle.backgroundColor + 'E6', // 90% opacity
                                variantStyle.backgroundColor + '80', // 50% opacity
                                variantStyle.backgroundColor + '00'  // 0% opacity (transparent)
                            ]}
                            style={StyleSheet.absoluteFillObject}
                            locations={[0, 0.3, 0.7, 1]}
                        />
                    </Animated.View>
                )}

                {/* Bottom fade indicator - only show when content overflows AND can scroll down */}
                {scrollable && showScrollIndicator && canScrollDown && (
                    <Animated.View
                        style={[
                            styles.fadeIndicator,
                            styles.fadeIndicatorBottom,
                            {
                                opacity: bottomFadeAnim,
                                borderBottomLeftRadius: sizeStyle.borderRadius,
                                borderBottomRightRadius: sizeStyle.borderRadius,
                            }
                        ]}
                        pointerEvents="none"
                    >
                        <LinearGradient
                            colors={[
                                variantStyle.backgroundColor + '00',  // 0% opacity (transparent)
                                variantStyle.backgroundColor + '80', // 50% opacity
                                variantStyle.backgroundColor + 'E6', // 90% opacity
                                variantStyle.backgroundColor         // 100% opacity
                            ]}
                            style={StyleSheet.absoluteFillObject}
                            locations={[0, 0.3, 0.7, 1]}
                        />
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
}

// AlertDialogHeader component
export interface AlertDialogHeaderProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
    return <View style={[styles.header, style]}>{children}</View>;
}

// AlertDialogTitle component
export interface AlertDialogTitleProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
    const { variant, size } = useAlertDialog();
    const variantStyle = alertDialogVariants.variant[variant];
    const sizeStyle = alertDialogVariants.size[size];

    return (
        <Text
            style={[
                styles.title,
                {
                    color: variantStyle.titleColor,
                    fontSize: sizeStyle.titleFontSize,
                },
                style
            ]}
            accessibilityRole="header"
        >
            {children}
        </Text>
    );
}

// AlertDialogDescription component
export interface AlertDialogDescriptionProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export function AlertDialogDescription({ children, style }: AlertDialogDescriptionProps) {
    const { variant, size } = useAlertDialog();
    const variantStyle = alertDialogVariants.variant[variant];
    const sizeStyle = alertDialogVariants.size[size];

    return (
        <Text
            style={[
                styles.description,
                {
                    color: variantStyle.descriptionColor,
                    fontSize: sizeStyle.descriptionFontSize,
                },
                style
            ]}
        >
            {children}
        </Text>
    );
}

// AlertDialogFooter component
export interface AlertDialogFooterProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    direction?: 'row' | 'column';
    spacing?: number;
    align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
}

export function AlertDialogFooter({
    children,
    style,
    direction = 'row',
    spacing = 12,
    align = 'flex-end',
}: AlertDialogFooterProps) {
    const footerStyle = {
        flexDirection: direction,
        gap: spacing,
        justifyContent: align,
        alignItems: 'center',
    };

    return (
        // @ts-ignore
        <View style={[styles.footer, footerStyle, style]}>
            {children}
        </View>
    );
}

// AlertDialogAction component (for primary actions like "Delete", "Confirm")
export interface AlertDialogActionProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
    autoClose?: boolean; // Whether to close dialog after action
}

export function AlertDialogAction({
    children,
    asChild = false,
    style,
    autoClose = true,
}: AlertDialogActionProps) {
    const { setIsOpen } = useAlertDialog();

    const handlePress = () => {
        // @ts-ignore
        children.props.onPress?.();
        if (autoClose) {
            setIsOpen(false);
        }
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            // @ts-ignore
            onPress: handlePress,
            // @ts-ignore
            style: [children.props.style, style],
        });
    }

    return (
        <Pressable onPress={handlePress} style={style}>
            {children}
        </Pressable>
    );
}

// AlertDialogCancel component (for cancel/dismiss actions)
export interface AlertDialogCancelProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function AlertDialogCancel({
    children,
    asChild = false,
    style
}: AlertDialogCancelProps) {
    const { setIsOpen } = useAlertDialog();

    const handlePress = () => {
        // @ts-ignore
        children.props.onPress?.();
        setIsOpen(false);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            // @ts-ignore
            onPress: handlePress,
            // @ts-ignore
            style: [children.props.style, style],
        });
    }

    return (
        <Pressable onPress={handlePress} style={style}>
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40, // Add vertical padding for safer spacing
    },
    content: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 15,
        // Ensure the dialog doesn't exceed screen bounds
        alignSelf: 'center',
        position: 'relative', // For absolute positioned fade indicators
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 8,
    },
    description: {
        lineHeight: 20,
        opacity: 0.8,
    },
    footer: {
        marginTop: 24,
        flexShrink: 0, // Prevent footer from shrinking
    },
    // Fade indicator styles - subtle gradient overlays
    fadeIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 20, // Subtle height for gentle fade
        pointerEvents: 'none', // Allow touches to pass through
        zIndex: 10,
    },
    fadeIndicatorTop: {
        top: 0,
    },
    fadeIndicatorBottom: {
        bottom: 0,
    },
});

export { alertDialogVariants };
