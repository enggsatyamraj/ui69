import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Define variants for the Badge component using theme colors
const badgeVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.foreground,         // Using theme.foreground instead of '#111827'
            textColor: currentTheme.background,              // Using theme.background instead of '#ffffff'
            borderColor: 'transparent',
        },
        primary: {
            backgroundColor: currentTheme.primary,           // Using theme.primary instead of '#3b82f6'
            textColor: currentTheme.primaryForeground,      // Using theme.primaryForeground instead of '#ffffff'
            borderColor: 'transparent',
        },
        secondary: {
            backgroundColor: currentTheme.secondary,         // Using theme.secondary instead of '#f1f5f9'
            textColor: currentTheme.secondaryForeground,    // Using theme.secondaryForeground instead of '#475569'
            borderColor: 'transparent',
        },
        success: {
            backgroundColor: '#22c55e',                      // Keep success color (theme doesn't have success)
            textColor: '#ffffff',                            // White text
            borderColor: 'transparent',
        },
        warning: {
            backgroundColor: '#f59e0b',                      // Keep warning color (theme doesn't have warning)
            textColor: '#ffffff',                            // White text
            borderColor: 'transparent',
        },
        error: {
            backgroundColor: currentTheme.destructive,      // Using theme.destructive instead of '#ef4444'
            textColor: currentTheme.destructiveForeground, // Using theme.destructiveForeground
            borderColor: 'transparent',
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: currentTheme.foreground,             // Using theme.foreground instead of '#475569'
            borderColor: currentTheme.border,               // Using theme.border instead of '#e2e8f0'
        },
        muted: {
            backgroundColor: currentTheme.muted,            // New: using theme.muted
            textColor: currentTheme.mutedForeground,       // New: using theme.mutedForeground
            borderColor: 'transparent',
        },
        accent: {
            backgroundColor: currentTheme.accent,           // New: using theme.accent
            textColor: currentTheme.accentForeground,      // New: using theme.accentForeground
            borderColor: 'transparent',
        },
    },
    size: {
        sm: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontSize: 11,
            borderRadius: radius.sm,                        // Using theme radius instead of hardcoded 8
            height: 18,
        },
        md: {
            paddingHorizontal: 8,
            paddingVertical: 3,
            fontSize: 12,
            borderRadius: radius.md,                        // Using theme radius instead of hardcoded 10
            height: 22,
        },
        lg: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            fontSize: 13,
            borderRadius: radius.lg,                        // Using theme radius instead of hardcoded 12
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

    // Font styling
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    fontStyle?: "normal" | "italic";
    fontFamily?: string;
    fontSize?: number;
    letterSpacing?: number;
    textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
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

    // Font styling props
    fontWeight,
    fontStyle,
    fontFamily,
    fontSize,
    letterSpacing,
    textTransform,
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
        fontSize: fontSize || sizeStyle.fontSize,
        fontWeight: fontWeight || '500',
        fontStyle: fontStyle,
        fontFamily: fontFamily,
        letterSpacing: letterSpacing,
        textTransform: textTransform,
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