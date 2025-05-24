import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

// Switch variants configuration
const switchVariants = {
    variant: {
        default: {
            backgroundColor: '#e4e4e7',
            thumbColor: '#ffffff',
            checkedBackgroundColor: '#18181b',
            checkedThumbColor: '#ffffff',
            disabledBackgroundColor: '#f4f4f5',
            disabledThumbColor: '#a1a1aa',
            disabledCheckedBackgroundColor: '#a1a1aa',
            textColor: '#09090b',
            disabledTextColor: '#a1a1aa',
            focusRingColor: '#18181b',
            errorColor: '#ef4444',
        },
        destructive: {
            backgroundColor: '#e4e4e7',
            thumbColor: '#ffffff',
            checkedBackgroundColor: '#ef4444',
            checkedThumbColor: '#ffffff',
            disabledBackgroundColor: '#f4f4f5',
            disabledThumbColor: '#a1a1aa',
            disabledCheckedBackgroundColor: '#a1a1aa',
            textColor: '#09090b',
            disabledTextColor: '#a1a1aa',
            focusRingColor: '#ef4444',
            errorColor: '#ef4444',
        },
        success: {
            backgroundColor: '#e4e4e7',
            thumbColor: '#ffffff',
            checkedBackgroundColor: '#22c55e',
            checkedThumbColor: '#ffffff',
            disabledBackgroundColor: '#f4f4f5',
            disabledThumbColor: '#a1a1aa',
            disabledCheckedBackgroundColor: '#a1a1aa',
            textColor: '#09090b',
            disabledTextColor: '#a1a1aa',
            focusRingColor: '#22c55e',
            errorColor: '#ef4444',
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

    // Animation values - using separate values to avoid conflicts
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
            useNativeDriver: true,
        }).start();
    }, [isChecked, enableAnimation, animationDuration]);

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

    // Calculate thumb position
    const thumbTranslateX = thumbAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, sizeStyle.width - sizeStyle.thumbSize - (sizeStyle.padding * 2)],
    });

    // Get colors based on state
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
            return variantStyle.disabledThumbColor;
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
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                )}
                {description && (
                    <Text
                        style={[
                            styles.description,
                            {
                                color: '#71717a',
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
                            padding: sizeStyle.padding,
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
                            color: isInvalid ? variantStyle.errorColor : '#71717a',
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
                <Text style={[styles.groupLabel, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
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
                            color: isInvalid ? '#ef4444' : '#71717a',
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
        color: '#ef4444',
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
        color: '#09090b',
        lineHeight: 20,
    },
    groupContainer: {
        flexWrap: 'wrap',
    },
});

export { switchVariants };