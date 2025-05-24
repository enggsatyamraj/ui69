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

// shadcn/ui exact color palette with variants
const checkboxVariants = {
    variant: {
        default: {
            backgroundColor: '#ffffff', // background
            borderColor: '#e4e4e7', // border
            checkedBackgroundColor: '#18181b', // primary
            checkedBorderColor: '#18181b', // primary
            checkColor: '#fafafa', // primary-foreground
            textColor: '#09090b', // foreground
            disabledBackgroundColor: '#fafafa', // muted
            disabledBorderColor: '#e4e4e7', // border
            disabledTextColor: '#a1a1aa', // muted-foreground
            focusBorderColor: '#18181b', // ring
            errorBorderColor: '#ef4444', // destructive
        },
        destructive: {
            backgroundColor: '#ffffff',
            borderColor: '#e4e4e7',
            checkedBackgroundColor: '#ef4444', // destructive
            checkedBorderColor: '#ef4444',
            checkColor: '#fef2f2', // destructive-foreground
            textColor: '#09090b',
            disabledBackgroundColor: '#fafafa',
            disabledBorderColor: '#e4e4e7',
            disabledTextColor: '#a1a1aa',
            focusBorderColor: '#ef4444',
            errorBorderColor: '#ef4444',
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: '#e4e4e7',
            checkedBackgroundColor: 'transparent',
            checkedBorderColor: '#18181b',
            checkColor: '#18181b',
            textColor: '#09090b',
            disabledBackgroundColor: 'transparent',
            disabledBorderColor: '#e4e4e7',
            disabledTextColor: '#a1a1aa',
            focusBorderColor: '#18181b',
            errorBorderColor: '#ef4444',
        },
        secondary: {
            backgroundColor: '#ffffff',
            borderColor: '#e4e4e7',
            checkedBackgroundColor: '#f4f4f5', // secondary
            checkedBorderColor: '#e4e4e7',
            checkColor: '#09090b', // secondary-foreground
            textColor: '#09090b',
            disabledBackgroundColor: '#fafafa',
            disabledBorderColor: '#e4e4e7',
            disabledTextColor: '#a1a1aa',
            focusBorderColor: '#18181b',
            errorBorderColor: '#ef4444',
        },
        success: {
            backgroundColor: '#ffffff',
            borderColor: '#e4e4e7',
            checkedBackgroundColor: '#22c55e', // green-500
            checkedBorderColor: '#22c55e',
            checkColor: '#ffffff',
            textColor: '#09090b',
            disabledBackgroundColor: '#fafafa',
            disabledBorderColor: '#e4e4e7',
            disabledTextColor: '#a1a1aa',
            focusBorderColor: '#22c55e',
            errorBorderColor: '#ef4444',
        },
    },
    size: {
        sm: {
            width: 16,
            height: 16,
            borderRadius: 4,
            borderWidth: 1,
            fontSize: 14,
            checkSize: 10,
            gap: 8,
        },
        md: {
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 2,
            fontSize: 14,
            checkSize: 12,
            gap: 12,
        },
        lg: {
            width: 24,
            height: 24,
            borderRadius: 8,
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
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                )}
                {description && (
                    <Text
                        style={[
                            styles.description,
                            {
                                color: '#71717a', // muted-foreground
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
                                ? '#ef4444' // destructive
                                : '#71717a', // muted-foreground
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
                            color: isInvalid ? '#ef4444' : '#71717a', // destructive : muted-foreground
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
        color: '#ef4444', // destructive
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
        color: '#09090b', // foreground
        lineHeight: 20,
    },
    groupContainer: {
        flexWrap: 'wrap',
    },
});

export { checkboxVariants };