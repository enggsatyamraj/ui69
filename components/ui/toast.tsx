import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import our theme
import { currentTheme } from '../../theme.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Toast variants using theme colors
const TOAST_VARIANTS = {
    default: {
        backgroundColor: currentTheme.card,              // Using theme.card instead of '#ffffff'
        borderColor: currentTheme.border,               // Using theme.border instead of '#e4e4e7'
        textColor: currentTheme.cardForeground,         // Using theme.cardForeground instead of '#18181b'
        iconColor: currentTheme.mutedForeground,        // Using theme.mutedForeground instead of '#71717a'
    },
    success: {
        backgroundColor: '#f0fdf4',                      // Keep success colors (theme doesn't have success)
        borderColor: '#16a34a',                          // Keep success colors
        textColor: '#15803d',                            // Keep success colors
        iconColor: '#16a34a',                            // Keep success colors
    },
    error: {
        backgroundColor: '#fef2f2',                      // Light red background
        borderColor: currentTheme.destructive,          // Using theme.destructive instead of '#dc2626'
        textColor: currentTheme.destructive,            // Using theme.destructive
        iconColor: currentTheme.destructive,            // Using theme.destructive
    },
    warning: {
        backgroundColor: '#fffbeb',                      // Keep warning colors (theme doesn't have warning)
        borderColor: '#d97706',                          // Keep warning colors
        textColor: '#d97706',                            // Keep warning colors
        iconColor: '#d97706',                            // Keep warning colors
    },
    info: {
        backgroundColor: '#eff6ff',                      // Keep info colors (theme doesn't have info)
        borderColor: '#2563eb',                          // Keep info colors
        textColor: '#2563eb',                            // Keep info colors
        iconColor: '#2563eb',                            // Keep info colors
    },
};

const POSITIONS = {
    'top-left': { top: true, left: true },
    'top-center': { top: true, center: true },
    'top-right': { top: true, right: true },
    'bottom-left': { bottom: true, left: true },
    'bottom-center': { bottom: true, center: true },
    'bottom-right': { bottom: true, right: true },
};

// Types
export interface ToastData {
    id: string;
    title?: string;
    description?: string;
    variant?: keyof typeof TOAST_VARIANTS;
    duration?: number;
    persistent?: boolean;
    action?: {
        label: string;
        onPress: () => void;
    };
    onDismiss?: () => void;
    icon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
}

type ToastContextType = {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => string;
    removeToast: (id: string) => void;
    removeAllToasts: () => void;
    position: keyof typeof POSITIONS;
    setPosition: (position: keyof typeof POSITIONS) => void;
    maxToasts: number;
    setMaxToasts: (max: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Provider Props
export interface ToastProviderProps {
    children: React.ReactNode;
    position?: keyof typeof POSITIONS;
    maxToasts?: number;
}

// Toast Provider
export const ToastProvider: React.FC<ToastProviderProps> = ({
    children,
    position: initialPosition = 'top-center',
    maxToasts: initialMaxToasts = 3,
}) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [position, setPosition] = useState<keyof typeof POSITIONS>(initialPosition);
    const [maxToasts, setMaxToasts] = useState(initialMaxToasts);

    const addToast = (toast: Omit<ToastData, 'id'>): string => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastData = {
            ...toast,
            id,
            duration: toast.duration ?? 2000,
            variant: toast.variant ?? 'default',
        };

        setToasts(prev => {
            const updated = [newToast, ...prev];
            return updated.slice(0, maxToasts);
        });

        if (!toast.persistent && newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const removeAllToasts = () => {
        setToasts([]);
    };

    const value: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        removeAllToasts,
        position,
        setPosition,
        maxToasts,
        setMaxToasts,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

// Individual Toast Item
interface ToastItemProps {
    toast: ToastData;
    onDismiss: () => void;
    index: number;
    totalToasts: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, index, totalToasts }) => {
    const translateY = useRef(new Animated.Value(-80)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const stackOffset = useRef(new Animated.Value(0)).current;

    const variantStyle = TOAST_VARIANTS[toast.variant || 'default'];

    useEffect(() => {
        // Initial entrance animation
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 8,
                delay: index * 50,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                delay: index * 50,
            }),
        ]).start();
    }, [index, opacity, translateY]);

    // Handle stacking animation when new toasts are added
    useEffect(() => {
        const targetOffset = index * (Platform.OS === 'web' ? 8 : 4); // Different offsets for web vs mobile

        Animated.spring(stackOffset, {
            toValue: targetOffset,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    }, [index, stackOffset]);

    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const handleStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX, velocityX } = event.nativeEvent;
            const shouldDismiss = Math.abs(translationX) > 100 || Math.abs(velocityX) > 800;

            if (shouldDismiss) {
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    onDismiss();
                    toast.onDismiss?.();
                });
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }).start();
            }
        }
    };

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -80,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
            toast.onDismiss?.();
        });
    };

    const renderIcon = () => {
        if (toast.icon) return toast.icon;

        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i',
            default: null,
        };

        const iconText = iconMap[toast.variant || 'default'];
        if (!iconText) return null;

        return (
            <View style={[styles.iconContainer, { backgroundColor: variantStyle.iconColor }]}>
                <Text style={styles.iconText}>{iconText}</Text>
            </View>
        );
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
            activeOffsetX={[-10, 10]}
        >
            <Animated.View
                style={[
                    styles.toastContainer,
                    {
                        backgroundColor: variantStyle.backgroundColor,
                        borderColor: variantStyle.borderColor,
                        transform: [
                            { translateY: Animated.add(translateY, stackOffset) },
                            { translateX }
                        ],
                        opacity,
                        zIndex: totalToasts - index, // Higher z-index for newer toasts
                    },
                    toast.style,
                ]}
            >
                {renderIcon()}

                <View style={styles.content}>
                    {toast.title && (
                        <Text
                            style={[
                                styles.title,
                                { color: variantStyle.textColor },
                                toast.titleStyle,
                            ]}
                            numberOfLines={1}
                        >
                            {toast.title}
                        </Text>
                    )}
                    {toast.description && (
                        <Text
                            style={[
                                styles.description,
                                { color: variantStyle.textColor },
                                toast.descriptionStyle,
                            ]}
                            numberOfLines={2}
                        >
                            {toast.description}
                        </Text>
                    )}

                    {toast.action && (
                        <Pressable
                            style={[styles.actionButton, { borderColor: variantStyle.borderColor }]}
                            onPress={toast.action.onPress}
                        >
                            <Text style={[styles.actionText, { color: variantStyle.iconColor }]}>
                                {toast.action.label}
                            </Text>
                        </Pressable>
                    )}
                </View>

                <Pressable style={styles.closeButton} onPress={handleClose}>
                    <Text style={[styles.closeText, { color: variantStyle.textColor }]}>✕</Text>
                </Pressable>
            </Animated.View>
        </PanGestureHandler>
    );
};

// Toast Container
const ToastContainer: React.FC = () => {
    const { toasts, removeToast, position } = useToast();
    const insets = useSafeAreaInsets();

    if (toasts.length === 0) return null;

    const positionStyle = POSITIONS[position];
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    const containerStyle: ViewStyle = {
        position: 'absolute',
        zIndex: 9999,
    };

    // Handle vertical positioning
    // @ts-ignore
    if (positionStyle.top) {
        containerStyle.top = insets.top + statusBarHeight + 16;
    }
    // @ts-ignore
    if (positionStyle.bottom) {
        containerStyle.bottom = insets.bottom + 16;
    }

    // Handle horizontal positioning
    // @ts-ignore
    if (positionStyle.left) {
        containerStyle.left = 16;
        containerStyle.right = Platform.OS === 'web' ? undefined : 16; // Ensure proper width on mobile
        containerStyle.alignItems = 'flex-start';
        // @ts-ignore
    } else if (positionStyle.right) {
        containerStyle.right = 16;
        containerStyle.left = Platform.OS === 'web' ? undefined : 16; // Ensure proper width on mobile
        containerStyle.alignItems = 'flex-end';
    } else {
        // Center
        containerStyle.left = 16;
        containerStyle.right = 16;
        containerStyle.alignItems = 'center';
    }

    return (
        <View style={containerStyle} pointerEvents="box-none">
            {toasts.map((toast, index) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onDismiss={() => removeToast(toast.id)}
                    index={index}
                    totalToasts={toasts.length}
                />
            ))}
        </View>
    );
};

// Easy-to-use hook
export const useToastController = () => {
    const { addToast, removeToast, removeAllToasts } = useToast();

    return {
        toast: addToast,
        success: (toast: Omit<ToastData, 'id' | 'variant'>) =>
            addToast({ ...toast, variant: 'success' }),
        error: (toast: Omit<ToastData, 'id' | 'variant'>) =>
            addToast({ ...toast, variant: 'error' }),
        warning: (toast: Omit<ToastData, 'id' | 'variant'>) =>
            addToast({ ...toast, variant: 'warning' }),
        info: (toast: Omit<ToastData, 'id' | 'variant'>) =>
            addToast({ ...toast, variant: 'info' }),
        dismiss: removeToast,
        dismissAll: removeAllToasts,
    };
};

const styles = StyleSheet.create({
    toastContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        width: Platform.OS === 'web' ? Math.min(380, SCREEN_WIDTH - 32) : SCREEN_WIDTH - 32,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 18,
        marginBottom: 2,
    },
    description: {
        fontSize: 13,
        lineHeight: 16,
        opacity: 0.8,
    },
    actionButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    closeText: {
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.5,
    },
});

export { TOAST_VARIANTS as toastVariants };
