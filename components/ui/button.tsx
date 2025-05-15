import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';

// Define variants similar to shadcn/ui but adapted for React Native
const buttonVariants = {
    variant: {
        default: {
            backgroundColor: '#000', // primary
            textColor: '#fff', // primary-foreground
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        destructive: {
            backgroundColor: '#ef4444', // destructive
            textColor: '#fff', // white
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        outline: {
            backgroundColor: '#fff', // background
            textColor: '#000', // text color  
            borderWidth: 1,
            borderColor: '#e2e8f0', // border color - explicitly not red
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        secondary: {
            backgroundColor: '#f1f5f9', // secondary
            textColor: '#0f172a', // secondary-foreground
            borderWidth: 0,
            borderColor: 'transparent',
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        ghost: {
            backgroundColor: 'transparent',
            textColor: '#0f172a', // text
            borderWidth: 0,
            borderColor: 'transparent',
        },
        link: {
            backgroundColor: 'transparent',
            textColor: '#2563eb', // primary for link
            borderWidth: 0,
            borderColor: 'transparent',
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: '#2563eb',
        },
    },
    size: {
        default: {
            height: 36, // h-9 equivalent
            paddingHorizontal: 16, // px-4 equivalent
            paddingVertical: 8, // py-2 equivalent
            borderRadius: 6, // rounded-md equivalent
            iconPaddingHorizontal: 12, // has-[>svg]:px-3 equivalent
            fontSize: 14, // text-sm equivalent
            iconSize: 16, // Default icon size
        },
        sm: {
            height: 32, // h-8 equivalent
            paddingHorizontal: 12, // px-3 equivalent
            paddingVertical: 6,
            borderRadius: 6, // rounded-md equivalent
            gap: 6, // gap-1.5 equivalent
            iconPaddingHorizontal: 10, // has-[>svg]:px-2.5 equivalent
            fontSize: 12, // smaller text
            iconSize: 14, // Smaller icon size
        },
        lg: {
            height: 40, // h-10 equivalent
            paddingHorizontal: 24, // px-6 equivalent
            paddingVertical: 10,
            borderRadius: 6, // rounded-md equivalent
            iconPaddingHorizontal: 16, // has-[>svg]:px-4 equivalent
            fontSize: 16, // larger text
            iconSize: 18, // Larger icon size
        },
        icon: {
            width: 36, // size-9 equivalent
            height: 36, // size-9 equivalent
            borderRadius: 6, // rounded-md equivalent
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
    let paddingHorizontal = sizeStyle.paddingHorizontal;
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
        width: isIconOnly ? sizeStyle.width : undefined, // Only set width for icon-only buttons
        borderRadius: sizeStyle.borderRadius,
        paddingHorizontal: isIconOnly ? 0 : paddingHorizontal,
        paddingVertical: isIconOnly ? 0 : paddingVertical,
        shadowOpacity: variantStyle.shadowOpacity,
        shadowRadius: variantStyle.shadowRadius,
        shadowOffset: variantStyle.shadowOffset,
        shadowColor: '#000',
        elevation: variantStyle.shadowOpacity ? 2 : 0, // Android shadow
        alignSelf: fullWidth ? 'stretch' : 'flex-start', // Full width if specified
    };

    // Use proper text style with correct color
    const textStyling = {
        color: variantStyle.textColor,
        fontWeight: '500',
        fontSize: fontSize || sizeStyle.fontSize, // Use custom fontSize if provided, otherwise use the size variant's fontSize
        textDecorationLine: variantStyle.textDecorationLine,
        textDecorationStyle: variantStyle.textDecorationStyle,
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