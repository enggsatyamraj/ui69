import React, { forwardRef, useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TextStyle,
    StyleProp,
    KeyboardTypeOptions,
    ReturnKeyTypeOptions,
} from 'react-native';

// Define input variants following shadcn/ui patterns
const inputVariants = {
    variant: {
        default: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            textColor: '#0f172a',
            placeholderColor: '#94a3b8',
            focusBorderColor: '#3b82f6',
            errorBorderColor: '#ef4444',
            disabledBackgroundColor: '#f8fafc',
            disabledTextColor: '#94a3b8',
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: '#e2e8f0',
            textColor: '#0f172a',
            placeholderColor: '#94a3b8',
            focusBorderColor: '#3b82f6',
            errorBorderColor: '#ef4444',
            disabledBackgroundColor: '#f8fafc',
            disabledTextColor: '#94a3b8',
        },
        filled: {
            backgroundColor: '#f1f5f9',
            borderColor: 'transparent',
            textColor: '#0f172a',
            placeholderColor: '#94a3b8',
            focusBorderColor: '#3b82f6',
            errorBorderColor: '#ef4444',
            disabledBackgroundColor: '#e2e8f0',
            disabledTextColor: '#94a3b8',
        },
        ghost: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: '#0f172a',
            placeholderColor: '#94a3b8',
            focusBorderColor: '#e2e8f0',
            errorBorderColor: '#ef4444',
            disabledBackgroundColor: 'transparent',
            disabledTextColor: '#94a3b8',
        },
    },
    size: {
        sm: {
            height: 32,
            paddingHorizontal: 12,
            paddingVertical: 6,
            fontSize: 13,
            borderRadius: 4,
            iconSize: 14,
        },
        md: {
            height: 40,
            paddingHorizontal: 16,
            paddingVertical: 8,
            fontSize: 14,
            borderRadius: 6,
            iconSize: 16,
        },
        lg: {
            height: 48,
            paddingHorizontal: 20,
            paddingVertical: 12,
            fontSize: 16,
            borderRadius: 8,
            iconSize: 18,
        },
    },
};

export interface InputProps extends Omit<TextInputProps, 'style'> {
    // Core props
    variant?: keyof typeof inputVariants.variant;
    size?: keyof typeof inputVariants.size;

    // Styling
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;

    // State management
    value?: string;
    defaultValue?: string;
    onChangeText?: (text: string) => void;

    // Validation
    isInvalid?: boolean;
    errorMessage?: string;
    helperText?: string;

    // Icons
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    iconColor?: string;

    // Customization
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    placeholderColor?: string;
    focusBorderColor?: string;
    errorBorderColor?: string;
    borderWidth?: number;
    borderRadius?: number;

    // Input behavior
    disabled?: boolean;
    readOnly?: boolean;
    clearable?: boolean;
    onClear?: () => void;

    // Labels and descriptions
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
    required?: boolean;

    // Keyboard and input options
    keyboardType?: KeyboardTypeOptions;
    returnKeyType?: ReturnKeyTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    secureTextEntry?: boolean;

    // Callbacks
    onFocus?: () => void;
    onBlur?: () => void;
    onSubmitEditing?: () => void;

    // Accessibility
    accessibilityLabel?: string;
    accessibilityHint?: string;
    testID?: string;

    // Multi-line support
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;

    // Text alignment
    textAlign?: 'left' | 'center' | 'right';
}

export const Input = forwardRef<TextInput, InputProps>(({
    // Core props
    variant = 'default',
    size = 'md',

    // Styling
    style,
    inputStyle,
    containerStyle,

    // State management
    value,
    defaultValue,
    onChangeText,

    // Validation
    isInvalid = false,
    errorMessage,
    helperText,

    // Icons
    leftIcon,
    rightIcon,
    iconColor,

    // Customization
    backgroundColor,
    borderColor,
    textColor,
    placeholderColor,
    focusBorderColor,
    errorBorderColor,
    borderWidth = 1,
    borderRadius,

    // Input behavior
    disabled = false,
    readOnly = false,
    clearable = false,
    onClear,

    // Labels and descriptions
    label,
    labelStyle,
    required = false,

    // Input options
    placeholder,
    keyboardType = 'default',
    returnKeyType = 'done',
    autoCapitalize = 'sentences',
    autoCorrect = true,
    secureTextEntry = false,

    // Callbacks
    onFocus,
    onBlur,
    onSubmitEditing,

    // Accessibility
    accessibilityLabel,
    accessibilityHint,
    testID,

    // Multi-line support
    multiline = false,
    numberOfLines = 1,
    maxLength,

    // Text alignment
    textAlign = 'left',

    // Other TextInput props
    ...textInputProps
}, ref) => {
    // State for focus
    const [isFocused, setIsFocused] = useState(false);

    // Get variant and size styles
    const variantStyle = inputVariants.variant[variant];
    const sizeStyle = inputVariants.size[size];

    // Handle focus events
    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    // Handle clear action
    const handleClear = () => {
        onChangeText?.('');
        onClear?.();
    };

    // Determine border color based on state
    const getBorderColor = () => {
        if (isInvalid) {
            return errorBorderColor || variantStyle.errorBorderColor;
        }
        if (isFocused) {
            return focusBorderColor || variantStyle.focusBorderColor;
        }
        return borderColor || variantStyle.borderColor;
    };

    // Build container styles
    const containerStyles = {
        backgroundColor: disabled
            ? variantStyle.disabledBackgroundColor
            : backgroundColor || variantStyle.backgroundColor,
        borderColor: getBorderColor(),
        borderWidth: variant === 'ghost' ? 0 : borderWidth,
        borderRadius: borderRadius || sizeStyle.borderRadius,
        height: multiline ? undefined : sizeStyle.height,
        minHeight: multiline ? sizeStyle.height : undefined,
        paddingHorizontal: leftIcon || rightIcon ? 8 : sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
    };

    // Build input styles
    const inputStyles = {
        flex: 1,
        color: disabled
            ? variantStyle.disabledTextColor
            : textColor || variantStyle.textColor,
        fontSize: sizeStyle.fontSize,
        textAlign,
        paddingHorizontal: leftIcon || rightIcon ? 8 : 0,
        paddingVertical: 0, // Remove default padding
        margin: 0, // Remove default margin
        textAlignVertical: multiline ? 'top' : 'center',
    };

    // Icon container styles
    const iconContainerStyle = {
        width: sizeStyle.iconSize + 4,
        height: sizeStyle.iconSize + 4,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    };

    // Render clear button if clearable and has value
    const renderClearButton = () => {
        if (!clearable || !value || disabled || readOnly) return null;

        return (
            <View style={iconContainerStyle}>
                <Text
                    style={[
                        styles.clearButton,
                        {
                            color: iconColor || variantStyle.placeholderColor,
                            fontSize: sizeStyle.iconSize
                        }
                    ]}
                    onPress={handleClear}
                >
                    ✕
                </Text>
            </View>
        );
    };

    return (
        <View style={[containerStyle]} testID={`${testID}-container`}>
            {/* Label */}
            {label && (
                <Text
                    style={[
                        styles.label,
                        {
                            color: isInvalid
                                ? variantStyle.errorBorderColor
                                : variantStyle.textColor,
                            fontSize: sizeStyle.fontSize - 1
                        },
                        labelStyle
                    ]}
                    testID={`${testID}-label`}
                >
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            {/* Input Container */}
            <View
                style={[
                    styles.inputContainer,
                    containerStyles,
                    disabled && styles.disabled,
                    style
                ]}
                testID={`${testID}-input-container`}
            >
                {/* Left Icon */}
                {leftIcon && (
                    <View style={iconContainerStyle}>
                        {leftIcon}
                    </View>
                )}

                {/* Text Input */}
                <TextInput
                    ref={ref}
                    // @ts-ignore
                    style={[styles.input, inputStyles, inputStyle]}
                    value={value}
                    defaultValue={defaultValue}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor || variantStyle.placeholderColor}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmitEditing={onSubmitEditing}
                    editable={!disabled && !readOnly}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    accessibilityLabel={accessibilityLabel || label}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={{ disabled }}
                    testID={testID}
                    {...textInputProps}
                />

                {/* Right Icon or Clear Button */}
                {clearable ? renderClearButton() : rightIcon && (
                    <View style={iconContainerStyle}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {/* Helper Text or Error Message */}
            {(helperText || errorMessage) && (
                <Text
                    style={[
                        styles.helperText,
                        {
                            color: isInvalid
                                ? variantStyle.errorBorderColor
                                : variantStyle.placeholderColor,
                            fontSize: sizeStyle.fontSize - 2
                        }
                    ]}
                    testID={`${testID}-helper`}
                >
                    {isInvalid ? errorMessage : helperText}
                </Text>
            )}
        </View>
    );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    input: {
        includeFontPadding: false,
    },
    disabled: {
        opacity: 0.6,
    },
    label: {
        fontWeight: '500',
        marginBottom: 6,
    },
    required: {
        color: '#ef4444',
    },
    helperText: {
        marginTop: 4,
        lineHeight: 16,
    },
    clearButton: {
        fontWeight: 'bold',
    },
});

export { inputVariants };