import React, { createContext, useContext, forwardRef, useState } from 'react';
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
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Radio variants using theme colors instead of hardcoded values
const radioVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.background,          // Using theme.background instead of '#ffffff'
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
            checkedBorderColor: currentTheme.primary,         // Using theme.primary instead of '#18181b'
            indicatorColor: currentTheme.primary,             // Using theme.primary instead of '#18181b'
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#09090b'
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted instead of '#fafafa'
            disabledBorderColor: currentTheme.border,         // Using theme.border instead of '#e4e4e7'
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground instead of '#a1a1aa'
            disabledIndicatorColor: currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#a1a1aa'
            focusBorderColor: currentTheme.ring,              // Using theme.ring instead of '#18181b'
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
        },
        destructive: {
            backgroundColor: currentTheme.background,          // Using theme.background instead of '#ffffff'
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
            checkedBorderColor: currentTheme.destructive,     // Using theme.destructive instead of '#ef4444'
            indicatorColor: currentTheme.destructive,         // Using theme.destructive instead of '#ef4444'
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#09090b'
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted instead of '#fafafa'
            disabledBorderColor: currentTheme.border,         // Using theme.border instead of '#e4e4e7'
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground instead of '#a1a1aa'
            disabledIndicatorColor: currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#a1a1aa'
            focusBorderColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
        },
        success: {
            backgroundColor: currentTheme.background,          // Using theme.background instead of '#ffffff'
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e4e4e7'
            checkedBorderColor: '#22c55e',                    // Keep green (theme doesn't have success colors)
            indicatorColor: '#22c55e',                        // Keep green
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#09090b'
            disabledBackgroundColor: currentTheme.muted,      // Using theme.muted instead of '#fafafa'
            disabledBorderColor: currentTheme.border,         // Using theme.border instead of '#e4e4e7'
            disabledTextColor: currentTheme.mutedForeground,  // Using theme.mutedForeground instead of '#a1a1aa'
            disabledIndicatorColor: currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#a1a1aa'
            focusBorderColor: '#22c55e',                      // Keep green focus
            errorBorderColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
        },
        secondary: {
            backgroundColor: currentTheme.background,          // New: using theme.background
            borderColor: currentTheme.border,                 // New: using theme.border
            checkedBorderColor: currentTheme.secondary,       // New: using theme.secondary
            indicatorColor: currentTheme.secondaryForeground, // New: using theme.secondaryForeground
            textColor: currentTheme.foreground,               // New: using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // New: using theme.muted
            disabledBorderColor: currentTheme.border,         // New: using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // New: using theme.mutedForeground
            disabledIndicatorColor: currentTheme.mutedForeground, // New: using theme.mutedForeground
            focusBorderColor: currentTheme.secondary,         // New: using theme.secondary
            errorBorderColor: currentTheme.destructive,       // New: using theme.destructive
        },
        accent: {
            backgroundColor: currentTheme.background,          // New: using theme.background
            borderColor: currentTheme.border,                 // New: using theme.border
            checkedBorderColor: currentTheme.accent,          // New: using theme.accent
            indicatorColor: currentTheme.accentForeground,    // New: using theme.accentForeground
            textColor: currentTheme.foreground,               // New: using theme.foreground
            disabledBackgroundColor: currentTheme.muted,      // New: using theme.muted
            disabledBorderColor: currentTheme.border,         // New: using theme.border
            disabledTextColor: currentTheme.mutedForeground,  // New: using theme.mutedForeground
            disabledIndicatorColor: currentTheme.mutedForeground, // New: using theme.mutedForeground
            focusBorderColor: currentTheme.accent,            // New: using theme.accent
            errorBorderColor: currentTheme.destructive,       // New: using theme.destructive
        },
    },
    size: {
        sm: {
            width: 16,
            height: 16,
            borderWidth: 1,
            indicatorSize: 10, // ~60% of width (16 * 0.6 = 9.6, rounded to 10)
            fontSize: 14,
            gap: 8,
        },
        md: {
            width: 20,
            height: 20,
            borderWidth: 2,
            indicatorSize: 12, // ~60% of width (20 * 0.6 = 12)
            fontSize: 14,
            gap: 12,
        },
        lg: {
            width: 24,
            height: 24,
            borderWidth: 2,
            indicatorSize: 14, // ~60% of width (24 * 0.6 = 14.4, rounded to 14)
            fontSize: 16,
            gap: 16,
        },
    },
};

// Radio Group Context
interface RadioGroupContextType {
    value: string | undefined;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    variant: keyof typeof radioVariants.variant;
    size: keyof typeof radioVariants.size;
    isInvalid?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

const useRadioGroup = () => {
    const context = useContext(RadioGroupContext);
    return context; // Can be undefined if used outside of RadioGroup
};

export interface RadioProps {
    // Core props
    value: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    variant?: keyof typeof radioVariants.variant;
    size?: keyof typeof radioVariants.size;

    // State
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;

    // Validation
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;

    // Styling
    style?: StyleProp<ViewStyle>;
    radioStyle?: StyleProp<ViewStyle>;
    indicatorStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;

    // Customization
    backgroundColor?: string;
    borderColor?: string;
    checkedBorderColor?: string;
    indicatorColor?: string;
    textColor?: string;

    // Content
    children?: React.ReactNode;
    label?: string;
    description?: string;
    descriptionStyle?: StyleProp<TextStyle>;

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

export const Radio = forwardRef<View, RadioProps>(({
    // Core props
    value,
    checked: controlledChecked,
    onCheckedChange,
    variant = 'default',
    size = 'md',

    // State
    disabled = false,
    required = false,
    readOnly = false,

    // Validation
    isInvalid = false,
    errorMessage,
    helperText,

    // Styling
    style,
    radioStyle,
    indicatorStyle,
    labelStyle,
    containerStyle,

    // Customization
    backgroundColor,
    borderColor,
    checkedBorderColor,
    indicatorColor,
    textColor,

    // Content
    children,
    label,
    description,
    descriptionStyle,

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
    // Radio group context
    const radioGroup = useRadioGroup();
    const [isFocused, setIsFocused] = useState(false);

    // Animation values
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const indicatorScale = React.useRef(new Animated.Value(0)).current;

    // Determine checked state
    let isChecked: boolean;
    if (radioGroup) {
        // When inside RadioGroup, use group's value
        isChecked = radioGroup.value === value;
    } else {
        // When standalone, use controlled checked prop
        isChecked = controlledChecked || false;
    }

    // Use group props if available
    const effectiveVariant = radioGroup?.variant || variant;
    const effectiveSize = radioGroup?.size || size;
    const effectiveDisabled = radioGroup?.disabled || disabled;
    const effectiveIsInvalid = radioGroup?.isInvalid || isInvalid;

    // Get variant and size styles
    const variantStyle = radioVariants.variant[effectiveVariant];
    const sizeStyle = radioVariants.size[effectiveSize];

    // Handle radio toggle
    const handleToggle = () => {
        if (effectiveDisabled || readOnly) return;

        if (radioGroup) {
            // When in group, set the group value
            radioGroup.onValueChange(value);
        } else {
            // When standalone, toggle checked state
            onCheckedChange?.(!isChecked);
        }

        onPress?.();

        // Scale animation for press feedback
        if (enableAnimation) {
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
            indicatorScale.setValue(isChecked ? 1 : 0);
            return;
        }

        Animated.spring(indicatorScale, {
            toValue: isChecked ? 1 : 0,
            useNativeDriver: true,
            tension: 200,
            friction: 15,
        }).start();
    }, [isChecked, enableAnimation]);

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
        if (effectiveDisabled) {
            return variantStyle.disabledBackgroundColor;
        }
        return backgroundColor || variantStyle.backgroundColor;
    };

    const getBorderColor = () => {
        if (effectiveDisabled) {
            return variantStyle.disabledBorderColor;
        }
        if (effectiveIsInvalid) {
            return variantStyle.errorBorderColor;
        }
        if (isFocused) {
            return variantStyle.focusBorderColor;
        }
        if (isChecked) {
            return checkedBorderColor || variantStyle.checkedBorderColor;
        }
        return borderColor || variantStyle.borderColor;
    };

    const getTextColor = () => {
        if (effectiveDisabled) {
            return variantStyle.disabledTextColor;
        }
        return textColor || variantStyle.textColor;
    };

    const getIndicatorColor = () => {
        if (effectiveDisabled) {
            return variantStyle.disabledIndicatorColor;
        }
        return indicatorColor || variantStyle.indicatorColor;
    };

    // Build radio styles
    const radioStyles = {
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: sizeStyle.width / 2, // Always circular
        borderWidth: sizeStyle.borderWidth,
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
    };

    const indicatorStyles = {
        width: sizeStyle.indicatorSize,
        height: sizeStyle.indicatorSize,
        borderRadius: sizeStyle.indicatorSize / 2,
        backgroundColor: getIndicatorColor(),
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
                    effectiveDisabled && styles.disabled,
                    style,
                ]}
                onPress={handleToggle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={effectiveDisabled}
                accessibilityRole="radio"
                accessibilityState={{
                    checked: isChecked,
                    disabled: effectiveDisabled,
                }}
                accessibilityLabel={accessibilityLabel || label}
                accessibilityHint={accessibilityHint}
                testID={testID}
            >
                <Animated.View
                    style={[
                        styles.radio,
                        radioStyles,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                        radioStyle,
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.indicator,
                            indicatorStyles,
                            {
                                transform: [{ scale: indicatorScale }],
                            },
                            indicatorStyle,
                        ]}
                    />
                </Animated.View>

                {renderLabel()}
            </Pressable>

            {/* Helper Text or Error Message */}
            {(helperText || errorMessage) && !radioGroup && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: effectiveIsInvalid
                                ? variantStyle.errorBorderColor
                                : currentTheme.mutedForeground, // Using theme.mutedForeground instead of '#71717a'
                            fontSize: sizeStyle.fontSize - 2,
                            marginLeft: labelPosition === 'left' ? 0 : sizeStyle.width + sizeStyle.gap,
                        },
                    ]}
                    testID={`${testID}-helper`}
                >
                    {effectiveIsInvalid ? errorMessage : helperText}
                </Text>
            )}
        </View>
    );
});

Radio.displayName = 'Radio';

// RadioGroup component for handling multiple radios
export interface RadioGroupProps {
    children: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    variant?: keyof typeof radioVariants.variant;
    size?: keyof typeof radioVariants.size;
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

export const RadioGroup: React.FC<RadioGroupProps> = ({
    children,
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled = false,
    variant = 'default',
    size = 'md',
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
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    const contextValue: RadioGroupContextType = {
        value: currentValue,
        onValueChange: handleValueChange,
        disabled,
        variant,
        size,
        isInvalid,
    };

    return (
        <RadioGroupContext.Provider value={contextValue}>
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
                    {children}
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
        </RadioGroupContext.Provider>
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
    radio: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    indicator: {
        // Indicator is styled dynamically
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontWeight: '500', // font-medium
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
        fontWeight: '600', // font-semibold
        lineHeight: 20,
    },
    groupContainer: {
        flexWrap: 'wrap',
    },
});

export { radioVariants };