import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

// Define variants for the Badge component
const badgeVariants = {
    variant: {
        default: {
            backgroundColor: '#111827', // Gray-900
            textColor: '#ffffff', // White
            borderColor: 'transparent',
        },
        primary: {
            backgroundColor: '#3b82f6', // Blue-500
            textColor: '#ffffff', // White
            borderColor: 'transparent',
        },
        secondary: {
            backgroundColor: '#f1f5f9', // Slate-100
            textColor: '#475569', // Slate-600
            borderColor: 'transparent',
        },
        success: {
            backgroundColor: '#22c55e', // Green-500
            textColor: '#ffffff', // White
            borderColor: 'transparent',
        },
        warning: {
            backgroundColor: '#f59e0b', // Amber-500
            textColor: '#ffffff', // White
            borderColor: 'transparent',
        },
        error: {
            backgroundColor: '#ef4444', // Red-500
            textColor: '#ffffff', // White
            borderColor: 'transparent',
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: '#475569', // Slate-600
            borderColor: '#e2e8f0', // Slate-200
        },
    },
    size: {
        sm: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontSize: 11,
            borderRadius: 8,
            height: 18,
        },
        md: {
            paddingHorizontal: 8,
            paddingVertical: 3,
            fontSize: 12,
            borderRadius: 10,
            height: 22,
        },
        lg: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            fontSize: 13,
            borderRadius: 12,
            height: 26,
        },
    },
};

export interface BadgeProps {
    // Core props
    children?: React.ReactNode;
    variant?: keyof typeof badgeVariants.variant;
    size?: keyof typeof badgeVariants.size;

    // Styling
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    backgroundColor?: string; // Custom background color
    textColor?: string; // Custom text color
    borderColor?: string; // Custom border color
    borderWidth?: number; // Custom border width
    icon?: React.ReactNode; // Optional icon element
    iconPosition?: 'left' | 'right';
}

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    style,
    textStyle,
    backgroundColor,
    textColor,
    borderColor,
    borderWidth = 1,
    icon,
    iconPosition = 'left',
}: BadgeProps) => {
    const variantStyle = badgeVariants.variant[variant];
    const sizeStyle = badgeVariants.size[size];

    // Apply badge styles based on variant and size
    const badgeStyle = {
        backgroundColor: backgroundColor || variantStyle.backgroundColor,
        borderColor: borderColor || variantStyle.borderColor,
        borderWidth: variant === 'outline' ? borderWidth : 0,
        borderRadius: sizeStyle.borderRadius,
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
        height: sizeStyle.height,
    };

    // Text style based on variant and size
    const textStyling = {
        color: textColor || variantStyle.textColor,
        fontSize: sizeStyle.fontSize,
        fontWeight: '500' as const,
    };

    return (
        <View
            style={[styles.badge, badgeStyle, style]}
            accessibilityRole="text"
        >
            {icon && iconPosition === 'left' && (
                <View style={styles.iconLeft}>{icon}</View>
            )}

            {typeof children === 'string' ? (
                <Text style={[styles.text, textStyling, textStyle]} numberOfLines={1}>
                    {children}
                </Text>
            ) : (
                children
            )}

            {icon && iconPosition === 'right' && (
                <View style={styles.iconRight}>{icon}</View>
            )}
        </View>
    );
};

// Dot badge variant for simple indicators
export const DotBadge = ({
    status = 'default',
    size = 'md',
    style,
}: {
    status?: keyof typeof badgeVariants.variant;
    size?: 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
}) => {
    const variantStyle = badgeVariants.variant[status];

    // Calculate dot size based on badge size
    const dotSize =
        size === 'sm' ? 8 :
            size === 'md' ? 10 :
                size === 'lg' ? 12 : 10;

    return (
        <View
            style={[
                styles.dot,
                {
                    backgroundColor: variantStyle.backgroundColor,
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                },
                style,
            ]}
            accessibilityRole="image"
        />
    );
};

// Base styles
const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start', // Don't stretch to fill container
    },
    text: {
        textAlign: 'center',
        includeFontPadding: false, // Remove extra padding for more accurate height
        textAlignVertical: 'center', // Center text vertically (Android)
    },
    iconLeft: {
        marginRight: 4,
    },
    iconRight: {
        marginLeft: 4,
    },
    dot: {
        alignSelf: 'center', // Center align dot vertically
    },
});

export { badgeVariants };