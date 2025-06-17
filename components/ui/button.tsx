import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { currentTheme, radius } from '../../theme.config';
// Import our theme directly - simple approach

// Define variants using theme colors instead of hardcoded values
const buttonVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.primary,           // Using theme.primary instead of '#000'
            textColor: currentTheme.primaryForeground,       // Using theme.primaryForeground instead of '#fff'
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        destructive: {
            backgroundColor: currentTheme.destructive,       // Using theme.destructive instead of '#ef4444'
            textColor: currentTheme.destructiveForeground,   // Using theme.destructiveForeground instead of '#fff'
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        outline: {
            backgroundColor: currentTheme.background,        // Using theme.background instead of '#fff'
            textColor: currentTheme.foreground,              // Using theme.foreground instead of '#000'
            borderWidth: 1,
            borderColor: currentTheme.border,                // Using theme.border instead of '#e2e8f0'
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        secondary: {
            backgroundColor: currentTheme.secondary,         // Using theme.secondary instead of '#f1f5f9'
            textColor: currentTheme.secondaryForeground,     // Using theme.secondaryForeground instead of '#0f172a'
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        ghost: {
            backgroundColor: 'transparent',
            textColor: currentTheme.foreground,              // Using theme.foreground instead of '#0f172a'
            borderWidth: 0,
            borderColor: 'transparent',
        },
        link: {
            backgroundColor: 'transparent',
            textColor: currentTheme.primary,                 // Using theme.primary instead of '#2563eb'
            borderWidth: 0,
            borderColor: 'transparent',
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: currentTheme.primary,       // Using theme.primary instead of '#2563eb'
        },
    },
    size: {
        default: {
            height: 36, // h-9 equivalent
            paddingHorizontal: 16, // px-4 equivalent
            paddingVertical: 8, // py-2 equivalent
            borderRadius: radius.md, // Using theme radius instead of hardcoded 6
            iconPaddingHorizontal: 12, // has-[>svg]:px-3 equivalent
            fontSize: 14, // text-sm equivalent
            iconSize: 16, // Default icon size
        },
        sm: {
            height: 32, // h-8 equivalent
            paddingHorizontal: 12, // px-3 equivalent
            paddingVertical: 6,
            borderRadius: radius.md, // Using theme radius instead of hardcoded 6
            gap: 6, // gap-1.5 equivalent
            iconPaddingHorizontal: 10, // has-[>svg]:px-2.5 equivalent
            fontSize: 12, // smaller text
            iconSize: 14, // Smaller icon size
        },
        lg: {
            height: 40, // h-10 equivalent
            paddingHorizontal: 24, // px-6 equivalent
            paddingVertical: 10,
            borderRadius: radius.md, // Using theme radius instead of hardcoded 6
            iconPaddingHorizontal: 16, // has-[>svg]:px-4 equivalent
            fontSize: 16, // larger text
            iconSize: 18, // Larger icon size
        },
        icon: {
            width: 36, // size-9 equivalent
            height: 36, // size-9 equivalent
            borderRadius: radius.md, // Using theme radius instead of hardcoded 6
            padding: 0,
            fontSize: 14, // default text size
            iconSize: 16, // Default icon size
        },
    },
};

export interface ButtonProps {
    children?: React.ReactNode;
    onPress?: () => void;
    variant?: keyof typeof buttonVariants.variant;
    size?: keyof typeof buttonVariants.size;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fontSize?: number; // Custom font size prop
    iconSize?: number; // Custom icon size prop
    padding?: number | { horizontal?: number; vertical?: number }; // Custom padding
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean; // Option for full width button
}

export const Button = ({
    children,
    onPress,
    variant = 'default',
    size = 'default',
    style,
    textStyle,
    fontSize, // Custom font size prop
    iconSize, // Custom icon size prop
    padding, // Custom padding
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
}: ButtonProps) => {
    const variantStyle = buttonVariants.variant[variant];
    const sizeStyle = buttonVariants.size[size];

    // Determine padding values
    // @ts-ignore
    let paddingHorizontal = sizeStyle.paddingHorizontal;
    // @ts-ignore
    let paddingVertical = sizeStyle.paddingVertical;

    // Override with custom padding if provided
    if (padding) {
        if (typeof padding === 'number') {
            paddingHorizontal = padding;
            paddingVertical = padding;
        } else {
            if (padding.horizontal !== undefined) {
                paddingHorizontal = padding.horizontal;
            }
            if (padding.vertical !== undefined) {
                paddingVertical = padding.vertical;
            }
        }
    }

    // Handle icon-only button (no children)
    const isIconOnly = !children && icon;

    // Apply button style based on variant and size
    const buttonStyle = {
        backgroundColor: variantStyle.backgroundColor,
        borderWidth: variantStyle.borderWidth,
        borderColor: variantStyle.borderColor || 'transparent', // Ensure border color is set or transparent
        height: isIconOnly ? sizeStyle.height : undefined, // Only set fixed height for icon-only buttons
        minHeight: !isIconOnly ? sizeStyle.height : undefined, // Use minHeight for text buttons to allow for multi-line text
        // @ts-ignore
        width: isIconOnly ? sizeStyle.width : undefined, // Only set width for icon-only buttons
        borderRadius: sizeStyle.borderRadius,
        paddingHorizontal: isIconOnly ? 0 : paddingHorizontal,
        paddingVertical: isIconOnly ? 0 : paddingVertical,
        // @ts-ignore
        shadowOpacity: variantStyle.shadowOpacity,
        // @ts-ignore
        shadowRadius: variantStyle.shadowRadius,
        // @ts-ignore
        shadowOffset: variantStyle.shadowOffset,
        shadowColor: '#000',
        // @ts-ignore
        elevation: variantStyle.shadowOpacity ? 2 : 0, // Android shadow
        alignSelf: fullWidth ? 'stretch' : 'flex-start', // Full width if specified
    };

    // Use proper text style with correct color
    const textStyling = {
        color: variantStyle.textColor,
        fontWeight: '500',
        fontSize: fontSize || sizeStyle.fontSize, // Use custom fontSize if provided, otherwise use the size variant's fontSize
        // @ts-ignore
        textDecorationLine: variantStyle.textDecorationLine,
        // @ts-ignore
        textDecorationStyle: variantStyle.textDecorationStyle,
        // @ts-ignore
        textDecorationColor: variantStyle.textDecorationColor,
    };

    // Determine icon container size
    const currentIconSize = iconSize || sizeStyle.iconSize || 16;
    const iconContainerStyle = {
        width: currentIconSize,
        height: currentIconSize,
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7} // Simulates hover effect
            style={[
                styles.button,
                // @ts-ignore
                buttonStyle,
                disabled && styles.disabled,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
        >
            {loading ? (
                <ActivityIndicator
                    color={variantStyle.textColor}
                    size="small"
                />
            ) : (
                <View style={[
                    styles.content,
                    // @ts-ignore
                    { gap: sizeStyle.gap || 8 }
                ]}>
                    {icon && (iconPosition === 'left' || isIconOnly) && (
                        <View style={[styles.icon, iconContainerStyle]}>
                            {icon}
                        </View>
                    )}

                    {children && (
                        <Text
                            style={[
                                styles.text,
                                // @ts-ignore
                                textStyling,
                                disabled && styles.disabledText,
                                textStyle,
                            ]}
                        >
                            {children}
                        </Text>
                    )}

                    {icon && iconPosition === 'right' && !isIconOnly && (
                        <View style={[styles.icon, iconContainerStyle]}>
                            {icon}
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

// Base styles
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
        overflow: 'hidden',
        // Remove any border that might be inherited from parent styles
        borderWidth: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    text: {
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.7,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
});

export { buttonVariants };