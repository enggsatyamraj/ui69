import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Modal,
    ScrollView,
    Dimensions,
    Platform,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Custom ChevronDown component with theme color support
const ChevronDown = ({ color = currentTheme.mutedForeground, size = 16 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M6 9L12 15L18 9"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Theme-based styles instead of hardcoded values
const COMMON_STYLES = {
    height: 40,
    borderRadius: radius.md,                            // Using theme radius instead of hardcoded 6
    padding: 12,
    fontSize: 14,
    backgroundColor: currentTheme.background,           // Using theme.background instead of '#ffffff'
    borderColor: currentTheme.border,                   // Using theme.border instead of '#e4e4e7'
    focusBorderColor: currentTheme.ring,                // Using theme.ring instead of '#18181b'
    textColor: currentTheme.foreground,                 // Using theme.foreground instead of '#09090b'
    placeholderColor: currentTheme.mutedForeground,     // Using theme.mutedForeground instead of '#71717a'
    contentBackground: currentTheme.popover,            // Using theme.popover instead of '#ffffff'
    contentBorder: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
    selectedBackground: currentTheme.accent,            // Using theme.accent instead of '#f4f4f5'
    hoverBackground: currentTheme.muted,                // Using theme.muted instead of '#f9fafb'
    disabledOpacity: 0.5,
};

// Types
interface SelectContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    value: string | undefined;
    onValueChange: (value: string) => void;
    triggerRef: React.RefObject<View>;
    placeholder?: string;
    disabled?: boolean;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
    const context = useContext(SelectContext);
    if (!context) {
        throw new Error('useSelect must be used within a Select component');
    }
    return context;
};

// Main Select component
export interface SelectProps {
    children: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    children,
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled = false,
    placeholder = "Select an option...",
}) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<View>(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!disabled) {
            setIsOpen(open);
        }
    };

    const value: SelectContextType = {
        isOpen,
        setIsOpen: handleOpenChange,
        value: currentValue,
        onValueChange: handleValueChange,
        // @ts-ignore
        triggerRef,
        placeholder,
        disabled,
    };

    return (
        <SelectContext.Provider value={value}>
            {children}
        </SelectContext.Provider>
    );
};

// SelectTrigger component
export interface SelectTriggerProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
    children,
    style,
}) => {
    const { setIsOpen, triggerRef, disabled, isOpen } = useSelect();
    const [isPressed, setIsPressed] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Smooth chevron rotation
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isOpen ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const handlePress = () => {
        setIsOpen(!isOpen);
    };

    const chevronRotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const triggerStyle = {
        backgroundColor: COMMON_STYLES.backgroundColor,
        borderColor: isOpen || isPressed ? COMMON_STYLES.focusBorderColor : COMMON_STYLES.borderColor,
        opacity: disabled ? COMMON_STYLES.disabledOpacity : 1,
    };

    return (
        <Pressable
            ref={triggerRef}
            style={[styles.trigger, triggerStyle, style]}
            onPress={handlePress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled, expanded: isOpen }}
        >
            <View style={styles.triggerContent}>
                <View style={styles.valueContainer}>
                    {children}
                </View>
                <Animated.View style={[styles.chevronContainer, { transform: [{ rotate: chevronRotation }] }]}>
                    <ChevronDown color={COMMON_STYLES.placeholderColor} size={20} />
                </Animated.View>
            </View>
        </Pressable>
    );
};

// SelectValue component
export interface SelectValueProps {
    placeholder?: string;
    style?: StyleProp<TextStyle>;
}

export const SelectValue: React.FC<SelectValueProps> = ({
    placeholder: propPlaceholder,
    style,
}) => {
    const { value, placeholder: contextPlaceholder } = useSelect();

    const placeholder = propPlaceholder || contextPlaceholder;
    const displayText = value || placeholder;
    const isPlaceholder = !value;

    return (
        <Text
            style={[
                styles.selectValue,
                {
                    color: isPlaceholder ? COMMON_STYLES.placeholderColor : COMMON_STYLES.textColor,
                },
                style,
            ]}
            numberOfLines={1}
        >
            {displayText}
        </Text>
    );
};

// SelectContent component
export interface SelectContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const SelectContent: React.FC<SelectContentProps> = ({
    children,
    style,
}) => {
    const { isOpen, setIsOpen, triggerRef } = useSelect();
    const [position, setPosition] = useState({ top: 0, left: 0, width: 200, showAbove: false });
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const slideAnim = useRef(new Animated.Value(-8)).current;

    useEffect(() => {
        if (isOpen) {
            const measurePosition = () => {
                if (!triggerRef.current) return;

                triggerRef.current.measureInWindow((windowX, windowY, width, height) => {
                    if (width > 0 && height > 0) {
                        triggerRef.current?.measure((x, y, measuredWidth, measuredHeight, pageX, pageY) => {
                            const triggerX = pageX || windowX;
                            const triggerY = pageY || windowY;
                            const triggerWidth = measuredWidth || width;
                            const triggerHeight = measuredHeight || height;

                            // Calculate available space
                            const spaceBelow = SCREEN_HEIGHT - (triggerY + triggerHeight) - insets.bottom - 20;
                            const spaceAbove = triggerY - insets.top - 20;
                            const dropdownHeight = 200;

                            let finalTop;
                            let showAbove = false;

                            if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
                                finalTop = triggerY + triggerHeight + 4;
                            } else {
                                finalTop = Math.max(insets.top + 20, triggerY - dropdownHeight - 4);
                                showAbove = true;
                            }

                            // Horizontal positioning with minimum width consideration
                            const margin = 16;
                            const minWidth = 200;
                            const dropdownWidth = Math.max(triggerWidth, minWidth);
                            let finalLeft = triggerX;

                            // Ensure dropdown doesn't go off-screen with new width
                            if (finalLeft + dropdownWidth > SCREEN_WIDTH - margin) {
                                finalLeft = SCREEN_WIDTH - dropdownWidth - margin;
                            }
                            if (finalLeft < margin) {
                                finalLeft = margin;
                            }

                            setPosition({
                                top: finalTop,
                                left: finalLeft,
                                width: dropdownWidth,
                                showAbove,
                            });

                            // Start animations
                            Animated.parallel([
                                Animated.timing(fadeAnim, {
                                    toValue: 1,
                                    duration: 200,
                                    useNativeDriver: true,
                                }),
                                Animated.spring(scaleAnim, {
                                    toValue: 1,
                                    useNativeDriver: true,
                                    tension: 200,
                                    friction: 15,
                                }),
                                Animated.spring(slideAnim, {
                                    toValue: 0,
                                    useNativeDriver: true,
                                    tension: 200,
                                    friction: 15,
                                }),
                            ]).start();
                        });
                    }
                });
            };

            const attemptMeasurement = () => {
                measurePosition();
                setTimeout(measurePosition, 16);
                setTimeout(measurePosition, 32);
            };

            attemptMeasurement();
        } else {
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.95);
            slideAnim.setValue(position.showAbove ? 8 : -8);
        }
    }, [isOpen, fadeAnim, scaleAnim, slideAnim, insets]);

    if (!isOpen) return null;

    return (
        <Modal
            transparent
            visible={isOpen}
            animationType="none"
            onRequestClose={() => setIsOpen(false)}
        >
            <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.content,
                                {
                                    position: 'absolute',
                                    top: position.top,
                                    left: position.left,
                                    width: position.width,
                                    opacity: fadeAnim,
                                    transform: [
                                        { scale: scaleAnim },
                                        { translateY: slideAnim },
                                    ],
                                },
                                style,
                            ]}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={styles.scrollView}
                                bounces={false}
                            >
                                {children}
                            </ScrollView>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

// SelectItem component
export interface SelectItemProps {
    children: React.ReactNode;
    value: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const SelectItem: React.FC<SelectItemProps> = ({
    children,
    value: itemValue,
    disabled = false,
    style,
    textStyle,
}) => {
    const { value: selectedValue, onValueChange } = useSelect();
    const [isPressed, setIsPressed] = useState(false);

    const isSelected = selectedValue === itemValue;

    const handlePress = () => {
        if (!disabled) {
            onValueChange(itemValue);
        }
    };

    return (
        <Pressable
            style={[
                styles.selectItem,
                isSelected && styles.selectItemSelected,
                isPressed && !disabled && styles.selectItemPressed,
                disabled && styles.selectItemDisabled,
                style,
            ]}
            onPress={handlePress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            disabled={disabled}
        >
            <View style={styles.selectItemContent}>
                <Text
                    style={[
                        styles.selectItemText,
                        { color: COMMON_STYLES.textColor },
                        isSelected && styles.selectItemTextSelected,
                        disabled && styles.selectItemTextDisabled,
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
                {isSelected && (
                    <Text style={[styles.checkmark, { color: COMMON_STYLES.textColor }]}>✓</Text>
                )}
            </View>
        </Pressable>
    );
};

// Simple utility components
export const SelectGroup: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
    <View style={style}>{children}</View>
);

export const SelectLabel: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }> = ({ children, style, textStyle }) => (
    <View style={[styles.selectLabel, style]}>
        <Text style={[styles.selectLabelText, { color: currentTheme.mutedForeground }, textStyle]}>{children}</Text>
    </View>
);

export const SelectSeparator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
    <View style={[styles.separator, { backgroundColor: COMMON_STYLES.contentBorder }, style]} />
);

const styles = StyleSheet.create({
    trigger: {
        height: COMMON_STYLES.height,
        borderWidth: 1,
        borderRadius: COMMON_STYLES.borderRadius,
        paddingHorizontal: COMMON_STYLES.padding,
        justifyContent: 'center',
    },
    triggerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    valueContainer: {
        flex: 1,
    },
    chevronContainer: {
        marginLeft: 8,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectValue: {
        fontSize: COMMON_STYLES.fontSize,
        lineHeight: 20,
    },
    overlay: {
        flex: 1,
    },
    content: {
        backgroundColor: COMMON_STYLES.contentBackground,
        borderRadius: COMMON_STYLES.borderRadius,
        borderWidth: 1,
        borderColor: COMMON_STYLES.contentBorder,
        paddingVertical: 4,
        maxHeight: SCREEN_HEIGHT * 0.4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 15,
    },
    scrollView: {
        maxHeight: SCREEN_HEIGHT * 0.4,
    },
    selectItem: {
        paddingHorizontal: COMMON_STYLES.padding,
        paddingVertical: 8,
        marginHorizontal: 2,
        marginVertical: 1,
        borderRadius: radius.sm,                            // Using theme radius instead of hardcoded 4
    },
    selectItemSelected: {
        backgroundColor: COMMON_STYLES.selectedBackground,
    },
    selectItemPressed: {
        backgroundColor: COMMON_STYLES.hoverBackground,
    },
    selectItemDisabled: {
        opacity: COMMON_STYLES.disabledOpacity,
    },
    selectItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 20,
    },
    selectItemText: {
        flex: 1,
        fontSize: COMMON_STYLES.fontSize,
        lineHeight: 20,
    },
    selectItemTextSelected: {
        fontWeight: '500',
    },
    selectItemTextDisabled: {
        color: currentTheme.mutedForeground,                // Using theme.mutedForeground instead of '#a1a1aa'
        opacity: 0.6,
    },
    checkmark: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    selectLabel: {
        paddingHorizontal: COMMON_STYLES.padding,
        paddingVertical: 6,
        paddingTop: 8,
    },
    selectLabelText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    separator: {
        height: 1,
        marginVertical: 4,
        marginHorizontal: 8,
    },
});

export default Select;