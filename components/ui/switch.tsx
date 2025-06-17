import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
// Import our theme
import { currentTheme } from '../../theme.config';

// Switch variants configuration using theme colors
const switchVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.border,
            thumbColor: currentTheme.background,
            checkedBackgroundColor: currentTheme.primary,
            checkedThumbColor: currentTheme.primaryForeground,
            // IMPROVED: Better disabled state colors for clarity
            disabledBackgroundColor: currentTheme.muted,           // Light gray for unchecked disabled
            disabledThumbColor: currentTheme.background,           // White thumb for unchecked disabled
            disabledCheckedBackgroundColor: currentTheme.mutedForeground, // Darker gray for checked disabled
            disabledCheckedThumbColor: currentTheme.muted,         // Light gray thumb for checked disabled
            textColor: currentTheme.foreground,
            disabledTextColor: currentTheme.mutedForeground,
            focusRingColor: currentTheme.ring,
            errorColor: currentTheme.destructive,
        },
        destructive: {
            backgroundColor: currentTheme.border,
            thumbColor: currentTheme.background,
            checkedBackgroundColor: currentTheme.destructive,
            checkedThumbColor: currentTheme.destructiveForeground,
            // IMPROVED: Better disabled state colors
            disabledBackgroundColor: currentTheme.muted,
            disabledThumbColor: currentTheme.background,
            disabledCheckedBackgroundColor: '#fca5a5',             // Light red for disabled checked destructive
            disabledCheckedThumbColor: currentTheme.muted,
            textColor: currentTheme.foreground,
            disabledTextColor: currentTheme.mutedForeground,
            focusRingColor: currentTheme.destructive,
            errorColor: currentTheme.destructive,
        },
        success: {
            backgroundColor: currentTheme.border,
            thumbColor: currentTheme.background,
            checkedBackgroundColor: '#22c55e',
            checkedThumbColor: '#ffffff',
            // IMPROVED: Better disabled state colors
            disabledBackgroundColor: currentTheme.muted,
            disabledThumbColor: currentTheme.background,
            disabledCheckedBackgroundColor: '#86efac',             // Light green for disabled checked success
            disabledCheckedThumbColor: currentTheme.muted,
            textColor: currentTheme.foreground,
            disabledTextColor: currentTheme.mutedForeground,
            focusRingColor: '#22c55e',
            errorColor: currentTheme.destructive,
        },
        secondary: {
            backgroundColor: currentTheme.border,
            thumbColor: currentTheme.background,
            checkedBackgroundColor: currentTheme.secondary,
            checkedThumbColor: currentTheme.secondaryForeground,
            // IMPROVED: Better disabled state colors
            disabledBackgroundColor: currentTheme.muted,
            disabledThumbColor: currentTheme.background,
            disabledCheckedBackgroundColor: currentTheme.mutedForeground,
            disabledCheckedThumbColor: currentTheme.muted,
            textColor: currentTheme.foreground,
            disabledTextColor: currentTheme.mutedForeground,
            focusRingColor: currentTheme.secondary,
            errorColor: currentTheme.destructive,
        },
        accent: {
            backgroundColor: currentTheme.border,
            thumbColor: currentTheme.background,
            checkedBackgroundColor: currentTheme.accent,
            checkedThumbColor: currentTheme.accentForeground,
            // IMPROVED: Better disabled state colors
            disabledBackgroundColor: currentTheme.muted,
            disabledThumbColor: currentTheme.background,
            disabledCheckedBackgroundColor: currentTheme.mutedForeground,
            disabledCheckedThumbColor: currentTheme.muted,
            textColor: currentTheme.foreground,
            disabledTextColor: currentTheme.mutedForeground,
            focusRingColor: currentTheme.accent,
            errorColor: currentTheme.destructive,
        },
    },
    size: {
        sm: {
            width: 32,
            height: 18,
            thumbSize: 14,
            padding: 2,
            fontSize: 14,
            gap: 8,
        },
        md: {
            width: 44,
            height: 24,
            thumbSize: 20,
            padding: 2,
            fontSize: 14,
            gap: 12,
        },
        lg: {
            width: 56,
            height: 32,
            thumbSize: 28,
            padding: 2,
            fontSize: 16,
            gap: 16,
        },
    },
};

export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    variant?: keyof typeof switchVariants.variant;
    size?: keyof typeof switchVariants.size;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;
    style?: StyleProp<ViewStyle>;
    switchStyle?: StyleProp<ViewStyle>;
    thumbStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    checkedBackgroundColor?: string;
    thumbColor?: string;
    checkedThumbColor?: string;
    textColor?: string;
    children?: React.ReactNode;
    label?: string;
    description?: string;
    descriptionStyle?: StyleProp<TextStyle>;
    labelPosition?: 'right' | 'left';
    alignItems?: 'flex-start' | 'center' | 'flex-end';
    animationDuration?: number;
    enableAnimation?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    testID?: string;
    onPress?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const Switch = forwardRef<View, SwitchProps>(({
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    variant = 'default',
    size = 'md',
    disabled = false,
    required = false,
    readOnly = false,
    isInvalid = false,
    errorMessage,
    helperText,
    style,
    switchStyle,
    thumbStyle,
    labelStyle,
    containerStyle,
    backgroundColor,
    checkedBackgroundColor,
    thumbColor,
    checkedThumbColor,
    textColor,
    children,
    label,
    description,
    descriptionStyle,
    labelPosition = 'right',
    alignItems = 'center',
    animationDuration = 200,
    enableAnimation = true,
    accessibilityLabel,
    accessibilityHint,
    testID,
    onPress,
    onFocus,
    onBlur,
}, ref) => {
    // Internal state
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [isFocused, setIsFocused] = useState(false);

    // Animation values
    const thumbAnimation = useRef(new Animated.Value(defaultChecked ? 1 : 0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    // Determine checked state
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    // Get styles
    const variantStyle = switchVariants.variant[variant];
    const sizeStyle = switchVariants.size[size];

    // Update animation when checked state changes
    useEffect(() => {
        if (!enableAnimation) {
            thumbAnimation.setValue(isChecked ? 1 : 0);
            return;
        }

        Animated.timing(thumbAnimation, {
            toValue: isChecked ? 1 : 0,
            duration: animationDuration,
            useNativeDriver: false, // Changed to false for translateX
        }).start();
    }, [isChecked, enableAnimation, animationDuration, thumbAnimation]);

    // Handle toggle
    const handleToggle = () => {
        if (disabled || readOnly) return;

        const newChecked = !isChecked;

        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        onCheckedChange?.(newChecked);
        onPress?.();

        // Scale feedback animation
        if (enableAnimation) {
            Animated.sequence([
                Animated.timing(scaleAnimation, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimation, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    // Focus handlers
    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    // Calculate thumb position - FIXED CALCULATION
    const thumbTranslateX = thumbAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            sizeStyle.padding,
            sizeStyle.width - sizeStyle.thumbSize - sizeStyle.padding
        ],
    });

    // Get colors based on state - IMPROVED for better disabled states
    const getCurrentBackgroundColor = () => {
        if (disabled) {
            return isChecked
                ? variantStyle.disabledCheckedBackgroundColor
                : variantStyle.disabledBackgroundColor;
        }
        if (isChecked) {
            return checkedBackgroundColor || variantStyle.checkedBackgroundColor;
        }
        return backgroundColor || variantStyle.backgroundColor;
    };

    const getCurrentThumbColor = () => {
        if (disabled) {
            // IMPROVED: Different thumb colors for disabled checked vs unchecked
            return isChecked
                ? variantStyle.disabledCheckedThumbColor
                : variantStyle.disabledThumbColor;
        }
        if (isChecked) {
            return checkedThumbColor || variantStyle.checkedThumbColor;
        }
        return thumbColor || variantStyle.thumbColor;
    };

    const getCurrentTextColor = () => {
        if (disabled) {
            return variantStyle.disabledTextColor;
        }
        return textColor || variantStyle.textColor;
    };

    // Render label
    const renderLabel = () => {
        if (!label && !children) return null;

        return (
            <View style={styles.labelContainer}>
                {(label || children) && (
                    <Text
                        style={[
                            styles.label,
                            {
                                color: getCurrentTextColor(),
                                fontSize: sizeStyle.fontSize,
                            },
                            labelStyle,
                        ]}
                    >
                        {children || label}
                        {required && <Text style={[styles.required, { color: currentTheme.destructive }]}> *</Text>}
                    </Text>
                )}
                {description && (
                    <Text
                        style={[
                            styles.description,
                            {
                                color: currentTheme.mutedForeground,
                                fontSize: sizeStyle.fontSize - 1,
                            },
                            descriptionStyle,
                        ]}
                    >
                        {description}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={[containerStyle]} testID={`${testID}-container`}>
            <Pressable
                ref={ref}
                style={[
                    styles.container,
                    {
                        alignItems,
                        gap: sizeStyle.gap,
                        flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
                    },
                    disabled && styles.disabled,
                    style,
                ]}
                onPress={handleToggle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                accessibilityRole="switch"
                accessibilityState={{
                    checked: isChecked,
                    disabled,
                }}
                accessibilityLabel={accessibilityLabel || label}
                accessibilityHint={accessibilityHint}
                testID={testID}
            >
                <Animated.View
                    style={[
                        styles.switch,
                        {
                            width: sizeStyle.width,
                            height: sizeStyle.height,
                            borderRadius: sizeStyle.height / 2,
                            backgroundColor: getCurrentBackgroundColor(),
                            borderWidth: isFocused ? 2 : 0,
                            borderColor: isFocused ? variantStyle.focusRingColor : 'transparent',
                            transform: [{ scale: scaleAnimation }],
                        },
                        switchStyle,
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.thumb,
                            {
                                width: sizeStyle.thumbSize,
                                height: sizeStyle.thumbSize,
                                borderRadius: sizeStyle.thumbSize / 2,
                                backgroundColor: getCurrentThumbColor(),
                                // FIXED: Dynamic positioning based on actual sizes
                                top: (sizeStyle.height - sizeStyle.thumbSize) / 2,
                                transform: [{ translateX: thumbTranslateX }],
                            },
                            thumbStyle,
                        ]}
                    />
                </Animated.View>

                {renderLabel()}
            </Pressable>

            {/* Helper Text or Error Message */}
            {(helperText || errorMessage) && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: isInvalid ? variantStyle.errorColor : currentTheme.mutedForeground,
                            fontSize: sizeStyle.fontSize - 2,
                            marginLeft: labelPosition === 'left' ? 0 : sizeStyle.width + sizeStyle.gap,
                        },
                    ]}
                    testID={`${testID}-helper`}
                >
                    {isInvalid ? errorMessage : helperText}
                </Text>
            )}
        </View>
    );
});

Switch.displayName = 'Switch';

// SwitchGroup component
export interface SwitchGroupProps {
    children: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    orientation?: 'horizontal' | 'vertical';
    spacing?: number;
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
    required?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
    children,
    disabled = false,
    style,
    orientation = 'vertical',
    spacing = 12,
    label,
    labelStyle,
    required = false,
    isInvalid = false,
    errorMessage,
    helperText,
}) => {
    return (
        <View style={[styles.group, style]}>
            {label && (
                <Text style={[styles.groupLabel, { color: currentTheme.foreground }, labelStyle]}>
                    {label}
                    {required && <Text style={[styles.required, { color: currentTheme.destructive }]}> *</Text>}
                </Text>
            )}

            <View
                style={[
                    styles.groupContainer,
                    {
                        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
                        gap: spacing,
                    },
                ]}
            >
                {React.Children.map(children, (child) => {
                    if (!React.isValidElement(child)) return child;

                    return React.cloneElement(child, {
                        // @ts-ignore
                        disabled: disabled || child.props.disabled,
                        // @ts-ignore
                        isInvalid: isInvalid || child.props.isInvalid,
                    });
                })}
            </View>

            {(helperText || errorMessage) && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: isInvalid ? currentTheme.destructive : currentTheme.mutedForeground,
                            fontSize: 12,
                        },
                    ]}
                >
                    {isInvalid ? errorMessage : helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    switch: {
        justifyContent: 'center',
        position: 'relative',
    },
    thumb: {
        position: 'absolute',
        // REMOVED: Fixed marginTop that was causing issues
        // marginTop: -10, // This was the problem!
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontWeight: '500',
        lineHeight: 20,
    },
    description: {
        marginTop: 4,
        lineHeight: 20,
    },
    required: {
        // color will be set dynamically using theme.destructive
    },
    helperText: {
        marginTop: 6,
        lineHeight: 18,
    },
    group: {
        gap: 12,
    },
    groupLabel: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 20,
    },
    groupContainer: {
        flexWrap: 'wrap',
    },
});

export { switchVariants };
