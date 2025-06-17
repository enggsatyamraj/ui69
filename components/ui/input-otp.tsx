import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    Clipboard,
    KeyboardTypeOptions,
    NativeSyntheticEvent,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Define input variants using theme colors
const inputOTPVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.background,
            borderColor: currentTheme.border,
            textColor: currentTheme.foreground,
            placeholderColor: currentTheme.mutedForeground,
            focusBorderColor: currentTheme.ring,
            errorBorderColor: currentTheme.destructive,
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: currentTheme.border,
            textColor: currentTheme.foreground,
            placeholderColor: currentTheme.mutedForeground,
            focusBorderColor: currentTheme.ring,
            errorBorderColor: currentTheme.destructive,
        },
        filled: {
            backgroundColor: currentTheme.muted,
            borderColor: 'transparent',
            textColor: currentTheme.foreground,
            placeholderColor: currentTheme.mutedForeground,
            focusBorderColor: currentTheme.ring,
            errorBorderColor: currentTheme.destructive,
        },
    },
    size: {
        sm: {
            width: 36,
            height: 36,
            fontSize: 16,
            borderRadius: radius.sm,
        },
        md: {
            width: 44,
            height: 44,
            fontSize: 20,
            borderRadius: radius.md,
        },
        lg: {
            width: 56,
            height: 56,
            fontSize: 24,
            borderRadius: radius.lg,
        },
    },
};

// Pre-defined patterns
export const PATTERNS = {
    NUMERIC: /^[0-9]$/,
    ALPHANUMERIC: /^[0-9a-zA-Z]$/,
    ALPHABETIC: /^[a-zA-Z]$/,
    LOWERCASE: /^[a-z]$/,
    UPPERCASE: /^[A-Z]$/,
    ANY: /^.$/,
};

// Types
type InputOTPContextType = {
    value: string;
    setValue: (value: string) => void;
    maxLength: number;
    disabled?: boolean;
    variant: keyof typeof inputOTPVariants.variant;
    size: keyof typeof inputOTPVariants.size;
    mask?: boolean;
    maskCharacter?: string;
    pattern?: RegExp;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    isInvalid?: boolean;
    handlePaste: () => void;
    handleKeyPress: (index: number, key: string) => void;
    handleTextChange: (index: number, text: string) => void;
    handleFocus: (index: number) => void;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    autoFocus?: boolean;
    inputRefs: React.RefObject<TextInput>[];
    inputProps?: React.ComponentProps<typeof TextInput> & {
        secureTextEntry?: boolean;
    };
    getKeyboardType: () => KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    inputMode?: 'numeric' | 'text';
    // Custom size props
    customWidth?: number;
    customHeight?: number;
    customFontSize?: number;
};

// Create context
const InputOTPContext = createContext<InputOTPContextType | undefined>(undefined);

// Hook to use the context
const useInputOTPContext = () => {
    const context = useContext(InputOTPContext);
    if (!context) {
        throw new Error('useInputOTPContext must be used within an InputOTP component');
    }
    return context;
};

// Main InputOTP component
export interface InputOTPProps {
    value?: string;
    defaultValue?: string;
    maxLength: number;
    disabled?: boolean;
    variant?: keyof typeof inputOTPVariants.variant;
    size?: keyof typeof inputOTPVariants.size;
    mask?: boolean;
    maskCharacter?: string;
    pattern?: RegExp | keyof typeof PATTERNS;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    style?: StyleProp<ViewStyle>;
    isInvalid?: boolean;
    autoFocus?: boolean;
    children: React.ReactNode;
    inputProps?: React.ComponentProps<typeof TextInput> & {
        secureTextEntry?: boolean;
    };
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    inputMode?: 'numeric' | 'text';
    // Custom size props
    customWidth?: number;   // Custom width in pixels
    customHeight?: number;  // Custom height in pixels
    customFontSize?: number; // Custom font size
}

export const InputOTP: React.FC<InputOTPProps> = ({
    value: controlledValue,
    defaultValue = '',
    maxLength,
    disabled = false,
    variant = 'default',
    size = 'md',
    mask = false,
    maskCharacter = '•',
    pattern = PATTERNS.NUMERIC,
    placeholder = '',
    onValueChange,
    onComplete,
    style,
    isInvalid = false,
    autoFocus = false,
    children,
    inputProps,
    autoCapitalize = 'none',
    inputMode = 'numeric',
    customWidth,
    customHeight,
    customFontSize,
}) => {
    // State for internal value handling
    const [internalValue, setInternalValue] = useState<string>(defaultValue || '');
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Create refs for all inputs
    const inputRefs = Array.from({ length: maxLength }).map(() => React.createRef<TextInput>());

    // Controlled vs uncontrolled handling
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Resolve pattern if string key is provided
    const resolvePattern = (): RegExp => {
        if (pattern instanceof RegExp) {
            return pattern;
        }

        if (typeof pattern === 'string' && pattern in PATTERNS) {
            return PATTERNS[pattern as keyof typeof PATTERNS];
        }

        return PATTERNS.NUMERIC; // Default to numeric
    };

    // Determine keyboard type based on pattern
    const getKeyboardType = (): KeyboardTypeOptions => {
        const currentPattern = resolvePattern();

        // For numeric only pattern
        if (currentPattern === PATTERNS.NUMERIC) {
            return 'number-pad';
        }

        // For alphanumeric and other patterns
        if (inputMode === 'numeric') {
            return 'number-pad';
        }

        // Default to text input
        return 'default';
    };

    // Update value
    const setValue = (newValue: string) => {
        // Limit to maxLength
        const limitedValue = newValue.slice(0, maxLength);

        // For uncontrolled component
        if (!isControlled) {
            setInternalValue(limitedValue);
        }

        // Call onChange if provided
        onValueChange && onValueChange(limitedValue);

        // Call onComplete if value is complete
        if (limitedValue.length === maxLength && onComplete) {
            onComplete(limitedValue);
        }
    };

    // Paste handler
    const handlePaste = async () => {
        try {
            let clipboardData = '';

            if (Platform.OS === 'web') {
                clipboardData = await navigator.clipboard.readText();
            } else {
                clipboardData = await Clipboard.getString();
            }

            if (clipboardData) {
                const actualPattern = resolvePattern();

                // Filter clipboard data to match pattern
                const filteredData = actualPattern
                    ? clipboardData
                        .split('')
                        .filter(char => actualPattern.test(char))
                        .join('')
                    : clipboardData;

                // Set the filtered value
                setValue(filteredData);

                // Focus the next empty input or the last input
                const nextEmptyIndex = Math.min(filteredData.length, maxLength - 1);
                setActiveIndex(nextEmptyIndex);
                inputRefs[nextEmptyIndex]?.current?.focus();
            }
        } catch (error) {
            console.error('Failed to read clipboard:', error);
        }
    };

    // Key press handler - for backspace and other control keys
    const handleKeyPress = (index: number, key: string) => {
        if (disabled) return;

        // Handle backspace
        if (key === 'Backspace') {
            if (value[index]) {
                // If current input has a value, clear it
                const newValue = value.split('');
                newValue[index] = '';
                setValue(newValue.join(''));
            } else if (index > 0) {
                // Otherwise, go to previous input and clear it
                const prevIndex = index - 1;
                const newValue = value.split('');
                newValue[prevIndex] = '';
                setValue(newValue.join(''));

                // Focus previous input
                setActiveIndex(prevIndex);
                inputRefs[prevIndex]?.current?.focus();
            }
        }
    };

    // Text change handler
    const handleTextChange = (index: number, text: string) => {
        if (disabled) return;

        // Extract the last character if multiple characters were input
        const char = text.slice(-1);

        // Check if the character matches the pattern
        const actualPattern = resolvePattern();

        if (text && (!actualPattern || actualPattern.test(char))) {
            // Update the value
            const newValue = value.padEnd(index, placeholder).split('');
            newValue[index] = char;

            // Set the new value
            setValue(newValue.join('').substring(0, maxLength));

            // Move focus to next input if available
            if (index < maxLength - 1) {
                setActiveIndex(index + 1);
                inputRefs[index + 1]?.current?.focus();
            } else {
                // We're at the last input - blur current input (hide keyboard)
                inputRefs[index]?.current?.blur();
            }
        }
    };

    // Focus handler
    const handleFocus = (index: number) => {
        setActiveIndex(index);
    };

    // Auto-focus first input on mount
    useEffect(() => {
        if (autoFocus && inputRefs[0]?.current) {
            setTimeout(() => {
                inputRefs[0]?.current?.focus();
            }, 100);
        }
    }, [autoFocus]);

    // Context value
    const contextValue: InputOTPContextType = {
        value,
        setValue,
        maxLength,
        disabled,
        variant,
        size,
        mask,
        maskCharacter,
        pattern: resolvePattern(),
        placeholder,
        onValueChange,
        onComplete,
        isInvalid,
        handlePaste,
        handleKeyPress,
        handleTextChange,
        handleFocus,
        activeIndex,
        setActiveIndex,
        autoFocus,
        // @ts-ignore
        inputRefs,
        inputProps,
        getKeyboardType,
        autoCapitalize,
        inputMode,
        customWidth,
        customHeight,
        customFontSize,
    };

    return (
        <InputOTPContext.Provider value={contextValue}>
            <View style={[styles.container, style]}>
                {children}
            </View>
        </InputOTPContext.Provider>
    );
};

// InputOTPGroup component for grouping slots
export interface InputOTPGroupProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const InputOTPGroup: React.FC<InputOTPGroupProps> = ({ children, style }) => {
    return <View style={[styles.group, style]}>{children}</View>;
};

// InputOTPSlot component for individual input slots
export interface InputOTPSlotProps {
    index: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

export const InputOTPSlot: React.FC<InputOTPSlotProps> = ({
    index,
    style,
    textStyle,
    containerStyle,
}) => {
    const {
        value,
        variant,
        size,
        placeholder,
        disabled,
        isInvalid,
        mask,
        maskCharacter,
        handleTextChange,
        handleKeyPress,
        handleFocus,
        activeIndex,
        inputRefs,
        inputProps,
        getKeyboardType,
        autoCapitalize,
        inputMode,
        customWidth,
        customHeight,
        customFontSize,
    } = useInputOTPContext();

    // Character for this slot
    const char = value[index] || '';

    // Get styles from variants
    const variantStyle = inputOTPVariants.variant[variant];
    const sizeStyle = inputOTPVariants.size[size];

    // Check if this input has focus
    const isFocused = activeIndex === index;

    // Apply styles with custom size support
    const inputStyles = {
        width: customWidth || sizeStyle.width,
        height: customHeight || sizeStyle.height,
        fontSize: customFontSize || sizeStyle.fontSize,
        color: variantStyle.textColor,
        borderRadius: sizeStyle.borderRadius,
        backgroundColor: variantStyle.backgroundColor,
        borderWidth: 1,
        borderColor: isInvalid
            ? variantStyle.errorBorderColor
            : isFocused
                ? variantStyle.focusBorderColor
                : variantStyle.borderColor,
    };

    // Handle key press
    const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        handleKeyPress(index, e.nativeEvent.key);
    };

    // Display value
    const displayValue = mask && char ? maskCharacter : char;

    // Determine keyboard type based on pattern
    const keyboardType = getKeyboardType();

    return (
        <View style={[styles.slotContainer, containerStyle]}>
            <TextInput
                ref={inputRefs[index]}
                // @ts-ignore
                style={[styles.input, inputStyles, style]}
                value={displayValue}
                onChangeText={(text) => handleTextChange(index, text)}
                onKeyPress={onKeyPress}
                onFocus={() => handleFocus(index)}
                keyboardType={inputProps?.keyboardType || keyboardType}
                autoCapitalize={autoCapitalize}
                maxLength={1}
                contextMenuHidden
                selectTextOnFocus={Platform.OS !== 'ios'} // On iOS, this causes issues with input selection
                editable={!disabled}
                placeholder={placeholder}
                placeholderTextColor={variantStyle.placeholderColor}
                testID={`otp-input-${index}`}
                caretHidden={Platform.OS !== 'web'} // Hide cursor on mobile but show on web
                textAlign="center"
                {...inputProps}
            />
        </View>
    );
};

// InputOTPSeparator component for visual separation between groups
export interface InputOTPSeparatorProps {
    separator?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const InputOTPSeparator: React.FC<InputOTPSeparatorProps> = ({
    separator,
    style,
}) => {
    return (
        <View style={[styles.separator, style]}>
            {separator || <Text style={[styles.separatorText, { color: currentTheme.mutedForeground }]}>-</Text>}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slotContainer: {
        margin: 4,
    },
    input: {
        textAlign: 'center',
    },
    separator: {
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separatorText: {
        fontSize: 24,
        fontWeight: '500',
    },
});

export { inputOTPVariants };
