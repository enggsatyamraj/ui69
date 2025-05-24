import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Modal,
    Dimensions,
    Platform,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableWithoutFeedback,
    ScrollView,
    BackHandler,
} from 'react-native';
import {
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define drawer variants
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

// Main Drawer component
export interface DrawerProps {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: keyof typeof drawerVariants.side;
    size?: keyof typeof drawerVariants.size;
    dismissible?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    side = 'bottom',
    size = 'md',
    dismissible = true,
}) => {
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
    };

    return (
        <DrawerContext.Provider value={value}>
            {children}
        </DrawerContext.Provider>
    );
};

// DrawerTrigger component
export interface DrawerTriggerProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
    children,
    asChild = false,
    style,
}) => {
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
};

// DrawerContent component
export interface DrawerContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
    children,
    style,
    overlayStyle,
}) => {
    const { isOpen, setIsOpen, side, size, dismissible } = useDrawer();
    const insets = useSafeAreaInsets();

    // Animation values
    const translateAnim = useRef(new Animated.Value(drawerVariants.side[side].startValue)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const gestureTranslateY = useRef(new Animated.Value(0)).current;

    // Gesture handling
    const [dragOffset, setDragOffset] = useState(0);
    const isDragging = useRef(false);

    // Function to handle smooth closing with animation
    const handleClose = () => {
        // First animate out, then call the state change
        const variant = drawerVariants.side[side];

        Animated.parallel([
            Animated.timing(translateAnim, {
                toValue: variant.startValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Reset gesture values after animation completes
            gestureTranslateY.setValue(0);
            setIsOpen(false);
        });
    };

    // Handle hardware back button on Android
    useEffect(() => {
        if (Platform.OS === 'android' && isOpen) {
            const handleBackPress = () => {
                if (dismissible) {
                    handleClose(); // Use smooth close animation
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => subscription.remove();
        }
    }, [isOpen, dismissible, setIsOpen]);

    // Animation effects
    useEffect(() => {
        if (isOpen) {
            // Animate in with less bouncy spring
            Animated.parallel([
                Animated.spring(translateAnim, {
                    toValue: drawerVariants.side[side].endValue,
                    useNativeDriver: true,
                    tension: 100, // Reduced from 120 for less bounce
                    friction: 14,  // Increased from 10 for more damping
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300, // Slightly longer for smoother feel
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Only animate out if we're not handling it manually
            if (!isDragging.current) {
                Animated.parallel([
                    Animated.timing(translateAnim, {
                        toValue: drawerVariants.side[side].startValue,
                        duration: 250, // Slightly faster exit
                        useNativeDriver: true,
                    }),
                    Animated.timing(overlayOpacity, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ]).start();
            }

            // Reset gesture values
            gestureTranslateY.setValue(0);
            setDragOffset(0);
        }
    }, [isOpen, side, translateAnim, overlayOpacity]);

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
                    // Use the smooth close function instead of direct state change
                    const variant = drawerVariants.side[side];
                    isDragging.current = false;

                    Animated.parallel([
                        Animated.timing(translateAnim, {
                            toValue: variant.startValue,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                        Animated.timing(overlayOpacity, {
                            toValue: 0,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        gestureTranslateY.setValue(0);
                        setIsOpen(false);
                    });
                } else {
                    // Snap back to position with less bounce
                    Animated.spring(gestureTranslateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 100, // Less bouncy
                        friction: 12,  // More damped
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
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
        };

        // Calculate size based on side and size prop
        if (side === 'top' || side === 'bottom') {
            drawerStyle.width = SCREEN_WIDTH;
            drawerStyle.height = SCREEN_HEIGHT * sizeValue;

            if (side === 'top') {
                drawerStyle.top = 0;
                drawerStyle.borderBottomLeftRadius = 16;
                drawerStyle.borderBottomRightRadius = 16;
                // Add top safe area padding
                drawerStyle.paddingTop = insets.top;
            } else {
                drawerStyle.bottom = 0;
                drawerStyle.borderTopLeftRadius = 16;
                drawerStyle.borderTopRightRadius = 16;
                // Add bottom safe area padding
                drawerStyle.paddingBottom = insets.bottom;
            }
        } else {
            // For left/right drawers, account for safe area
            drawerStyle.height = SCREEN_HEIGHT;
            drawerStyle.width = SCREEN_WIDTH * sizeValue;

            if (side === 'left') {
                drawerStyle.left = 0;
                drawerStyle.borderTopRightRadius = 16;
                drawerStyle.borderBottomRightRadius = 16;
                // Add left safe area padding and top/bottom insets
                drawerStyle.paddingLeft = insets.left;
                drawerStyle.paddingTop = insets.top;
                drawerStyle.paddingBottom = insets.bottom;
            } else {
                drawerStyle.right = 0;
                drawerStyle.borderTopLeftRadius = 16;
                drawerStyle.borderBottomLeftRadius = 16;
                // Add right safe area padding and top/bottom insets
                drawerStyle.paddingRight = insets.right;
                drawerStyle.paddingTop = insets.top;
                drawerStyle.paddingBottom = insets.bottom;
            }
        }

        return drawerStyle;
    };

    // Handle overlay press
    const handleOverlayPress = () => {
        if (dismissible && !isDragging.current) {
            handleClose(); // Use smooth close animation
        }
    };

    if (!isOpen) return null;

    const drawerStyle = getDrawerStyle();
    const variant = drawerVariants.side[side];

    return (
        <DrawerContentContext.Provider value={{ handleClose }}>
            <Modal
                transparent
                visible={isOpen}
                animationType="none"
                onRequestClose={() => dismissible && setIsOpen(false)}
            >
                {/* Overlay */}
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: overlayOpacity,
                        },
                        overlayStyle,
                    ]}
                >
                    <TouchableWithoutFeedback onPress={handleOverlayPress}>
                        <View style={StyleSheet.absoluteFillObject} />
                    </TouchableWithoutFeedback>
                </Animated.View>

                {/* Drawer Content */}
                <PanGestureHandler
                    onGestureEvent={handleGestureEvent}
                    onHandlerStateChange={handleStateChange}
                    enabled={dismissible && side === 'bottom'} // Enable gesture only for bottom drawer for now
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
                                <View style={styles.dragIndicator} />
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
            </Modal>
        </DrawerContentContext.Provider>
    );
};

// DrawerHeader component
export interface DrawerHeaderProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ children, style }) => {
    return <View style={[styles.header, style]}>{children}</View>;
};

// DrawerTitle component
export interface DrawerTitleProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export const DrawerTitle: React.FC<DrawerTitleProps> = ({ children, style }) => {
    return (
        <Text style={[styles.title, style]} accessibilityRole="header">
            {children}
        </Text>
    );
};

// DrawerDescription component
export interface DrawerDescriptionProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

export const DrawerDescription: React.FC<DrawerDescriptionProps> = ({ children, style }) => {
    return <Text style={[styles.description, style]}>{children}</Text>;
};

// DrawerFooter component
export interface DrawerFooterProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ children, style }) => {
    return <View style={[styles.footer, style]}>{children}</View>;
};

// DrawerClose component
export interface DrawerCloseProps {
    children: React.ReactElement;
    asChild?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const DrawerClose: React.FC<DrawerCloseProps> = ({
    children,
    asChild = false,
    style,
}) => {
    const { handleClose } = useDrawerContent(); // Use smooth close function from content context

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
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dragHandle: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 32,
        height: 4,
        backgroundColor: '#d1d5db',
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
        color: '#111827',
        marginBottom: 8,
        lineHeight: 24,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
});

export { drawerVariants };