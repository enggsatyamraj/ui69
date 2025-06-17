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
import {
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define drawer variants using theme colors
const drawerVariants = {
    side: {
        top: {
            translateProperty: 'translateY',
            startValue: -SCREEN_HEIGHT,
            endValue: 0,
            dimension: 'height',
        },
        bottom: {
            translateProperty: 'translateY',
            startValue: SCREEN_HEIGHT,
            endValue: 0,
            dimension: 'height',
        },
        left: {
            translateProperty: 'translateX',
            startValue: -SCREEN_WIDTH,
            endValue: 0,
            dimension: 'width',
        },
        right: {
            translateProperty: 'translateX',
            startValue: SCREEN_WIDTH,
            endValue: 0,
            dimension: 'width',
        },
    },
    size: {
        sm: 0.25,
        md: 0.5,
        lg: 0.75,
        full: 1,
    },
};

// Types
interface DrawerContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    side: keyof typeof drawerVariants.side;
    size: keyof typeof drawerVariants.size;
    onOpenChange?: (open: boolean) => void;
    dismissible: boolean;
    customWidth?: number;
    customHeight?: number;
}

interface DrawerContentContextType {
    handleClose: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
const DrawerContentContext = createContext<DrawerContentContextType | undefined>(undefined);

// Hook to use drawer context
const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a Drawer component');
    }
    return context;
};

// Hook to use drawer content context
const useDrawerContent = () => {
    const context = useContext(DrawerContentContext);
    if (!context) {
        throw new Error('useDrawerContent must be used within a DrawerContent component');
    }
    return context;
};

// Main Drawer component (Root)
export interface DrawerProps {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: keyof typeof drawerVariants.side;
    size?: keyof typeof drawerVariants.size;
    dismissible?: boolean;
    customWidth?: number; // Custom width in pixels for left/right drawers
    customHeight?: number; // Custom height in pixels for top/bottom drawers
}

export function Drawer({
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    side = 'bottom',
    size = 'md',
    dismissible = true,
    customWidth,
    customHeight,
}: DrawerProps) {
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

    const value: DrawerContextType = {
        isOpen,
        setIsOpen: handleOpenChange,
        side,
        size,
        onOpenChange,
        dismissible,
        customWidth,
        customHeight,
    };

    return (
        <DrawerContext.Provider value={value}>
            {children}
        </DrawerContext.Provider>
    );
}

// DrawerTrigger component
export interface DrawerTriggerProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function DrawerTrigger({
    children,
    asChild = false,
    style,
}: DrawerTriggerProps) {
    const { setIsOpen } = useDrawer();

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

// DrawerPortal component - Using Modal for proper full-screen rendering
export interface DrawerPortalProps {
    children: React.ReactNode;
}

export function DrawerPortal({ children }: DrawerPortalProps) {
    const { isOpen } = useDrawer();

    return (
        <Modal
            transparent={true}
            visible={isOpen}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={() => { }}
        >
            {children}
        </Modal>
    );
}

// DrawerOverlay component - Simple, no complex animations
export interface DrawerOverlayProps {
    style?: StyleProp<ViewStyle>;
}

export function DrawerOverlay({ style }: DrawerOverlayProps) {
    const { isOpen, setIsOpen, dismissible } = useDrawer();
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(overlayOpacity, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const handlePress = () => {
        if (dismissible) {
            setIsOpen(false); // Simple instant close
        }
    };

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

// DrawerContent component - Simple version
export interface DrawerContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function DrawerContent({ children, style }: DrawerContentProps) {
    const { isOpen, setIsOpen, side, size, dismissible, customWidth, customHeight } = useDrawer();
    const insets = useSafeAreaInsets();

    // Animation values
    const translateAnim = useRef(new Animated.Value(drawerVariants.side[side].startValue)).current;
    const gestureTranslateY = useRef(new Animated.Value(0)).current;

    // Gesture handling
    const isDragging = useRef(false);

    // Simple close function - no animation
    const handleClose = () => {
        setIsOpen(false); // Instant close
    };

    // Handle hardware back button on Android
    useEffect(() => {
        if (Platform.OS === 'android' && isOpen) {
            const handleBackPress = () => {
                if (dismissible) {
                    setIsOpen(false); // Instant close
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => subscription.remove();
        }
    }, [isOpen, dismissible, setIsOpen]);

    // Animation effects for opening only
    useEffect(() => {
        if (isOpen) {
            // Animate in with spring animation
            Animated.spring(translateAnim, {
                toValue: drawerVariants.side[side].endValue,
                useNativeDriver: true,
                tension: 100,
                friction: 14,
            }).start();
        } else {
            // Instant reset to start position when closed
            translateAnim.setValue(drawerVariants.side[side].startValue);
            gestureTranslateY.setValue(0);
        }
    }, [isOpen, side, translateAnim]);

    // Handle pan gesture events
    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: gestureTranslateY } }],
        {
            useNativeDriver: true,
            listener: (event: any) => {
                // Constrain the gesture translation to prevent negative values (dragging up)
                const translationY = event.nativeEvent.translationY;
                if (translationY < 0) {
                    gestureTranslateY.setValue(0);
                }
            }
        }
    );

    const handleStateChange = (event: any) => {
        const { state, translationY, velocityY } = event.nativeEvent;

        if (state === State.BEGAN) {
            isDragging.current = true;
        }

        if (state === State.END || state === State.CANCELLED) {
            isDragging.current = false;

            // Only handle bottom drawer swipe down for now
            if (side === 'bottom' && dismissible) {
                const shouldClose = translationY > 100 || velocityY > 1000;

                if (shouldClose) {
                    setIsOpen(false); // Instant close
                } else {
                    // Snap back to position with spring animation
                    Animated.spring(gestureTranslateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 12,
                    }).start();
                }
            }
        }
    };

    // Calculate drawer dimensions and positioning
    const getDrawerStyle = () => {
        const variant = drawerVariants.side[side];
        const sizeValue = drawerVariants.size[size];

        let drawerStyle: any = {
            position: 'absolute',
            backgroundColor: currentTheme.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
        };

        // Calculate size based on side and size prop
        if (side === 'top' || side === 'bottom') {
            drawerStyle.width = SCREEN_WIDTH;
            // Use custom height if provided, otherwise use percentage of screen
            drawerStyle.height = customHeight || (SCREEN_HEIGHT * sizeValue);

            if (side === 'top') {
                drawerStyle.top = 0;
                drawerStyle.borderBottomLeftRadius = radius.lg;
                drawerStyle.borderBottomRightRadius = radius.lg;
                drawerStyle.paddingTop = insets.top;
            } else {
                drawerStyle.bottom = 0;
                drawerStyle.borderTopLeftRadius = radius.lg;
                drawerStyle.borderTopRightRadius = radius.lg;
                drawerStyle.paddingBottom = insets.bottom;
            }
        } else {
            // For left/right drawers, account for safe area
            drawerStyle.height = SCREEN_HEIGHT;
            // Use custom width if provided, otherwise use percentage of screen
            drawerStyle.width = customWidth || (SCREEN_WIDTH * sizeValue);

            if (side === 'left') {
                drawerStyle.left = 0;
                drawerStyle.borderTopRightRadius = radius.lg;
                drawerStyle.borderBottomRightRadius = radius.lg;
                drawerStyle.paddingLeft = insets.left;
                drawerStyle.paddingTop = insets.top;
                drawerStyle.paddingBottom = insets.bottom;
            } else {
                drawerStyle.right = 0;
                drawerStyle.borderTopLeftRadius = radius.lg;
                drawerStyle.borderBottomLeftRadius = radius.lg;
                drawerStyle.paddingRight = insets.right;
                drawerStyle.paddingTop = insets.top;
                drawerStyle.paddingBottom = insets.bottom;
            }
        }

        return drawerStyle;
    };

    if (!isOpen) return null;

    const drawerStyle = getDrawerStyle();
    const variant = drawerVariants.side[side];

    return (
        <DrawerContentContext.Provider value={{ handleClose }}>
            <PanGestureHandler
                onGestureEvent={handleGestureEvent}
                onHandlerStateChange={handleStateChange}
                enabled={dismissible && side === 'bottom'}
            >
                <Animated.View
                    style={[
                        drawerStyle,
                        {
                            transform: [
                                {
                                    [variant.translateProperty]: Animated.add(
                                        translateAnim,
                                        side === 'bottom' ? gestureTranslateY : 0
                                    ),
                                },
                            ],
                        },
                        style,
                    ]}
                >
                    {/* Drag Handle for bottom drawer */}
                    {side === 'bottom' && dismissible && (
                        <View style={styles.dragHandle}>
                            <View style={[styles.dragIndicator, { backgroundColor: currentTheme.border }]} />
                        </View>
                    )}

                    <View style={styles.contentContainer}>
                        <ScrollView
                            style={styles.scrollContent}
                            contentContainerStyle={styles.scrollContentContainer}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            scrollEnabled={!isDragging.current}
                        >
                            {children}
                        </ScrollView>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </DrawerContentContext.Provider>
    );
}

// DrawerHeader component
export interface DrawerHeaderProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function DrawerHeader({ children, style }: DrawerHeaderProps) {
    return <View style={[styles.header, style]}>{children}</View>;
}

// DrawerTitle component
export interface DrawerTitleProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export function DrawerTitle({ children, style }: DrawerTitleProps) {
    return (
        <Text style={[styles.title, { color: currentTheme.foreground }, style]} accessibilityRole="header">
            {children}
        </Text>
    );
}

// DrawerDescription component
export interface DrawerDescriptionProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export function DrawerDescription({ children, style }: DrawerDescriptionProps) {
    return <Text style={[styles.description, { color: currentTheme.mutedForeground }, style]}>{children}</Text>;
}

// DrawerFooter component
export interface DrawerFooterProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function DrawerFooter({ children, style }: DrawerFooterProps) {
    return <View style={[styles.footer, { borderTopColor: currentTheme.border }, style]}>{children}</View>;
}

// DrawerClose component
export interface DrawerCloseProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function DrawerClose({ children, asChild = false, style }: DrawerCloseProps) {
    const { handleClose } = useDrawerContent(); // Uses simple instant close

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            // @ts-ignore
            onPress: handleClose,
            // @ts-ignore
            style: [children.props.style, style],
        });
    }

    return (
        <Pressable onPress={handleClose} style={style}>
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    dragHandle: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 32,
        height: 4,
        borderRadius: 2,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 24,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
    },
});

export { drawerVariants };
