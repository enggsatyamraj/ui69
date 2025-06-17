import React, { forwardRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    StyleProp,
    ViewStyle,
    TextStyle,
    Platform,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Professional Check Icon Component
const CheckIcon = ({ size = 12, color = '#fafafa' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 6L9 17L4 12"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Professional Minus Icon for Indeterminate
const MinusIcon = ({ size = 12, color = '#fafafa' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line
            x1={6}
            y1={12}
            x2={18}
            y2={12}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
        />
    </Svg>
);

// Checkbox variants using theme colors
const checkboxVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.background,          // Using theme.background instead of '#ffffff'
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
            checkedBackgroundColor: currentTheme.primary,     // Using theme.primary instead of '#18181b'
            checkedBorderColor: currentTheme.primary,         // Using theme.primary instead of '#18181b'
            checkColor: currentTheme.primaryForeground,       // Using theme.primaryForeground instead of '#fafafa'
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#09090b'
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted instead of '#fafafa'
            disabledBorderColor: currentTheme.border,         // Using theme.border instead of '#e4e4e7'
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground instead of '#a1a1aa'
            focusBorderColor: currentTheme.ring,              // Using theme.ring instead of '#18181b'
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
        },
        destructive: {
            backgroundColor: currentTheme.background,          // Using theme.background
            borderColor: currentTheme.border,                 // Using theme.border
            checkedBackgroundColor: currentTheme.destructive, // Using theme.destructive instead of '#ef4444'
            checkedBorderColor: currentTheme.destructive,     // Using theme.destructive
            checkColor: currentTheme.destructiveForeground,   // Using theme.destructiveForeground instead of '#fef2f2'
            textColor: currentTheme.foreground,               // Using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted
            disabledBorderColor: currentTheme.border,         // Using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground
            focusBorderColor: currentTheme.destructive,       // Using theme.destructive
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
            checkedBackgroundColor: 'transparent',
            checkedBorderColor: currentTheme.primary,         // Using theme.primary instead of '#18181b'
            checkColor: currentTheme.primary,                 // Using theme.primary instead of '#18181b'
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#09090b'
            disabledBackgroundColor: 'transparent',
            disabledBorderColor: currentTheme.border,         // Using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground
            focusBorderColor: currentTheme.primary,           // Using theme.primary
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive
        },
        secondary: {
            backgroundColor: currentTheme.background,          // Using theme.background
            borderColor: currentTheme.border,                 // Using theme.border
            checkedBackgroundColor: currentTheme.secondary,   // Using theme.secondary instead of '#f4f4f5'
            checkedBorderColor: currentTheme.border,          // Using theme.border
            checkColor: currentTheme.secondaryForeground,     // Using theme.secondaryForeground instead of '#09090b'
            textColor: currentTheme.foreground,               // Using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted
            disabledBorderColor: currentTheme.border,         // Using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground
            focusBorderColor: currentTheme.ring,              // Using theme.ring
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive
        },
        success: {
            backgroundColor: currentTheme.background,          // Using theme.background
            borderColor: currentTheme.border,                 // Using theme.border
            checkedBackgroundColor: '#22c55e',                // Keep green (theme doesn't have success)
            checkedBorderColor: '#22c55e',                    // Keep green
            checkColor: '#ffffff',                            // White check
            textColor: currentTheme.foreground,               // Using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted
            disabledBorderColor: currentTheme.border,         // Using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground
            focusBorderColor: '#22c55e',                      // Green focus
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive
        },
        accent: {
            backgroundColor: currentTheme.background,          // New: using theme.background
            borderColor: currentTheme.border,                 // New: using theme.border
            checkedBackgroundColor: currentTheme.accent,      // New: using theme.accent
            checkedBorderColor: currentTheme.accent,          // New: using theme.accent
            checkColor: currentTheme.accentForeground,        // New: using theme.accentForeground
            textColor: currentTheme.foreground,               // New: using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // New: using theme.muted
            disabledBorderColor: currentTheme.border,         // New: using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // New: using theme.mutedForeground
            focusBorderColor: currentTheme.accent,            // New: using theme.accent
            errorBorderColor: currentTheme.destructive,       // New: using theme.destructive
        },
    },
    size: {
        sm: {
            width: 16,
            height: 16,
            borderRadius: radius.sm,                          // Using theme radius instead of hardcoded 4
            borderWidth: 1,
            fontSize: 14,
            checkSize: 10,
            gap: 8,
        },
        md: {
            width: 20,
            height: 20,
            borderRadius: radius.md,                          // Using theme radius instead of hardcoded 6
            borderWidth: 2,
            fontSize: 14,
            checkSize: 12,
            gap: 12,
        },
        lg: {
            width: 24,
            height: 24,
            borderRadius: radius.lg,                          // Using theme radius instead of hardcoded 8
            borderWidth: 2,
            fontSize: 16,
            checkSize: 14,
            gap: 16,
        },
    },
};

export interface CheckboxProps {
    // Core props
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    variant?: keyof typeof checkboxVariants.variant;
    size?: keyof typeof checkboxVariants.size;

    // State
    disabled?: boolean;
    indeterminate?: boolean;
    required?: boolean;
    readOnly?: boolean;

    // Validation
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;

    // Styling
    style?: StyleProp<ViewStyle>;
    checkboxStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;

    // Custom checkbox shape
    shape?: 'square' | 'circle';

    // Customization
    backgroundColor?: string;
    borderColor?: string;
    checkedBackgroundColor?: string;
    checkedBorderColor?: string;
    checkColor?: string;
    textColor?: string;
    borderRadius?: number;
    borderWidth?: number;

    // Content
    children?: React.ReactNode;
    label?: string;
    description?: string;
    descriptionStyle?: StyleProp<TextStyle>;

    // Icon customization
    checkIcon?: React.ReactNode;
    indeterminateIcon?: React.ReactNode;
    useCustomIcons?: boolean; // Force custom icons over SVG

    // Layout
    labelPosition?: 'right' | 'left';
    alignItems?: 'flex-start' | 'center' | 'flex-end';

    // Animation
    animationDuration?: number;
    enableAnimation?: boolean;

    // Accessibility
    accessibilityLabel?: string;
    accessibilityHint?: string;
    testID?: string;

    // Events
    onPress?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const Checkbox = forwardRef<View, CheckboxProps>(({
    // Core props
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    variant = 'default',
    size = 'md',

    // State
    disabled = false,
    indeterminate = false,
    required = false,
    readOnly = false,

    // Validation
    isInvalid = false,
    errorMessage,
    helperText,

    // Styling
    style,
    checkboxStyle,
    labelStyle,
    containerStyle,

    // Custom shape
    shape = 'square',

    // Customization
    backgroundColor,
    borderColor,
    checkedBackgroundColor,
    checkedBorderColor,
    checkColor,
    textColor,
    borderRadius,
    borderWidth,

    // Content
    children,
    label,
    description,
    descriptionStyle,

    // Icon customization
    checkIcon,
    indeterminateIcon,
    useCustomIcons = false,

    // Layout
    labelPosition = 'right',
    alignItems = 'flex-start',

    // Animation
    animationDuration = 200,
    enableAnimation = true,

    // Accessibility
    accessibilityLabel,
    accessibilityHint,
    testID,

    // Events
    onPress,
    onFocus,
    onBlur,
}, ref) => {
    // State management
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [isFocused, setIsFocused] = useState(false);

    // Animation values
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;
    const checkScaleAnim = React.useRef(new Animated.Value(0)).current;

    // Controlled vs uncontrolled
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    // Get variant and size styles
    const variantStyle = checkboxVariants.variant[variant];
    const sizeStyle = checkboxVariants.size[size];

    // Handle checkbox toggle
    const handleToggle = () => {
        if (disabled || readOnly) return;

        const newChecked = !isChecked;

        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        onCheckedChange?.(newChecked);
        onPress?.();

        // Animation
        if (enableAnimation) {
            // Scale animation for press feedback
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: animationDuration / 4,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: animationDuration / 4,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    // Animation effects for checked state
    React.useEffect(() => {
        if (!enableAnimation) {
            opacityAnim.setValue(isChecked || indeterminate ? 1 : 0);
            checkScaleAnim.setValue(isChecked || indeterminate ? 1 : 0);
            return;
        }

        if (isChecked || indeterminate) {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.spring(checkScaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 200,
                    friction: 15,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: animationDuration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(checkScaleAnim, {
                    toValue: 0,
                    duration: animationDuration / 2,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isChecked, indeterminate, enableAnimation, animationDuration]);

    // Handle focus events
    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    // Determine colors based on state
    const getBackgroundColor = () => {
        if (disabled) {
            return variantStyle.disabledBackgroundColor;
        }
        if (isChecked || indeterminate) {
            return checkedBackgroundColor || variantStyle.checkedBackgroundColor;
        }
        return backgroundColor || variantStyle.backgroundColor;
    };

    const getBorderColor = () => {
        if (disabled) {
            return variantStyle.disabledBorderColor;
        }
        if (isInvalid) {
            return variantStyle.errorBorderColor;
        }
        if (isFocused) {
            return variantStyle.focusBorderColor;
        }
        if (isChecked || indeterminate) {
            return checkedBorderColor || variantStyle.checkedBorderColor;
        }
        return borderColor || variantStyle.borderColor;
    };

    const getTextColor = () => {
        if (disabled) {
            return variantStyle.disabledTextColor;
        }
        return textColor || variantStyle.textColor;
    };

    // Calculate border radius based on shape
    const getCheckboxBorderRadius = () => {
        if (borderRadius !== undefined) return borderRadius;
        if (shape === 'circle') return sizeStyle.width / 2;
        return sizeStyle.borderRadius;
    };

    // Build checkbox styles
    const checkboxStyles = {
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: getCheckboxBorderRadius(),
        borderWidth: borderWidth !== undefined ? borderWidth : sizeStyle.borderWidth,
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
    };

    // Render check icon
    const renderCheckIcon = () => {
        const iconColor = checkColor || variantStyle.checkColor;
        const iconSize = sizeStyle.checkSize;

        if (indeterminate && indeterminateIcon) {
            return indeterminateIcon;
        }

        if (indeterminate) {
            // Use SVG minus icon for indeterminate unless custom icons are forced
            if (useCustomIcons) {
                return (
                    <View
                        style={[
                            styles.indeterminateIcon,
                            {
                                backgroundColor: iconColor,
                                width: iconSize * 0.6,
                                height: 2,
                            },
                        ]}
                    />
                );
            } else {
                return <MinusIcon size={iconSize} color={iconColor} />;
            }
        }

        if (isChecked && checkIcon) {
            return checkIcon;
        }

        if (isChecked) {
            // Use SVG check icon unless custom icons are forced
            if (useCustomIcons) {
                return (
                    <Text
                        style={[
                            styles.checkIcon,
                            {
                                color: iconColor,
                                fontSize: iconSize,
                            },
                        ]}
                    >
                        ✓
                    </Text>
                );
            } else {
                return <CheckIcon size={iconSize} color={iconColor} />;
            }
        }

        return null;
    };

    // Render label content
    const renderLabel = () => {
        if (!label && !children) return null;

        return (
            <View style={styles.labelContainer}>
                {(label || children) && (
                    <Text
                        style={[
                            styles.label,
                            {
                                color: getTextColor(),
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
                                color: currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#71717a'
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
                accessibilityRole="checkbox"
                accessibilityState={{
                    checked: indeterminate ? 'mixed' : isChecked,
                    disabled,
                }}
                accessibilityLabel={accessibilityLabel || label}
                accessibilityHint={accessibilityHint}
                testID={testID}
            >
                <Animated.View
                    style={[
                        styles.checkbox,
                        checkboxStyles,
                        checkboxStyle,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.checkContainer,
                            {
                                opacity: opacityAnim,
                                transform: [{ scale: checkScaleAnim }],
                            },
                        ]}
                    >
                        {renderCheckIcon()}
                    </Animated.View>
                </Animated.View>

                {renderLabel()}
            </Pressable>

            {/* Helper Text or Error Message */}
            {(helperText || errorMessage) && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: isInvalid
                                ? currentTheme.destructive // Using theme.destructive instead of '#ef4444'
                                : currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#71717a'
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

Checkbox.displayName = 'Checkbox';

// CheckboxGroup component for handling multiple checkboxes
export interface CheckboxGroupProps {
    children: React.ReactNode;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
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

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    children,
    value: controlledValue,
    defaultValue = [],
    onValueChange,
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
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (itemValue: string, checked: boolean) => {
        let newValue: string[];

        if (checked) {
            newValue = [...currentValue, itemValue];
        } else {
            newValue = currentValue.filter(v => v !== itemValue);
        }

        if (!isControlled) {
            setInternalValue(newValue);
        }

        onValueChange?.(newValue);
    };

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
                {React.Children.map(children, (child, index) => {
                    if (!React.isValidElement(child)) return child;

                    // Clone checkbox with group props
                    return React.cloneElement(child, {
                        // @ts-ignore
                        checked: currentValue.includes(child.props.value),
                        onCheckedChange: (checked: boolean) => {
                            // @ts-ignore
                            handleValueChange(child.props.value, checked);
                            // @ts-ignore
                            child.props.onCheckedChange?.(checked);
                        },
                        // @ts-ignore
                        disabled: disabled || child.props.disabled,
                        // @ts-ignore
                        isInvalid: isInvalid || child.props.isInvalid,
                    });
                })}
            </View>

            {/* Group Helper Text or Error Message */}
            {(helperText || errorMessage) && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: isInvalid ? currentTheme.destructive : currentTheme.mutedForeground, // Using theme colors
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
        alignItems: 'flex-start',
    },
    disabled: {
        opacity: 0.5, // shadcn uses 50% opacity for disabled
    },
    checkbox: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    checkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        fontWeight: '600', // font-medium in shadcn
        textAlign: 'center',
        includeFontPadding: false,
    },
    indeterminateIcon: {
        borderRadius: 1,
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontWeight: '500', // font-medium
        lineHeight: 20, // leading-none equivalent
    },
    description: {
        marginTop: 4, // space-y-1
        lineHeight: 20,
    },
    required: {
        // color will be set dynamically using theme.destructive
    },
    helperText: {
        marginTop: 6, // space-y-1.5
        lineHeight: 18,
    },
    group: {
        gap: 12, // space-y-3
    },
    groupLabel: {
        fontSize: 16, // text-base
        fontWeight: '600', // font-semibold
        lineHeight: 20,
    },
    groupContainer: {
        flexWrap: 'wrap',
    },
});

export { checkboxVariants };