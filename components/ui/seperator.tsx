import React from 'react';
import { View, StyleSheet } from 'react-native';
// Import our theme
import { currentTheme } from '../../theme.config';

// Define variants for the Separator component using theme colors
const separatorVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.border,              // Using theme.border instead of '#64748b'
            opacity: 1, // Full opacity for clean look
        },
        subtle: {
            backgroundColor: currentTheme.mutedForeground,     // Using theme.mutedForeground instead of '#94a3b8'
            opacity: 0.3, // More subtle opacity
        },
        strong: {
            backgroundColor: currentTheme.foreground,          // Using theme.foreground instead of '#1e293b'
            opacity: 0.8, // Strong but not overwhelming
        },
        muted: {
            backgroundColor: currentTheme.muted,               // New: using theme.muted
            opacity: 1, // Full opacity for muted background
        },
        accent: {
            backgroundColor: currentTheme.accent,              // New: using theme.accent
            opacity: 0.6, // Moderate opacity for accent
        },
        destructive: {
            backgroundColor: currentTheme.destructive,         // New: using theme.destructive
            opacity: 0.8, // Strong but not overwhelming
        },
    },
    orientation: {
        horizontal: {
            height: 1,
            width: '100%',
            borderRadius: 1, // Slight rounding for style
        },
        vertical: {
            width: 1,
            height: '100%',
            borderRadius: 1,
        },
    },
};

export interface SeparatorProps {
    variant?: keyof typeof separatorVariants.variant;
    orientation?: keyof typeof separatorVariants.orientation;
    style?: React.ComponentProps<typeof View>['style'];
    thickness?: number; // Custom thickness for the separator
    color?: string; // Custom color for the separator
    opacity?: number; // Custom opacity
    margin?: number; // Custom margin around separator
    marginHorizontal?: number; // Custom horizontal margin
    marginVertical?: number; // Custom vertical margin
}

export const Separator = ({
    variant = 'default',
    orientation = 'horizontal',
    style,
    thickness,
    color,
    opacity,
    margin,
    marginHorizontal,
    marginVertical,
}: SeparatorProps) => {
    const variantStyle = separatorVariants.variant[variant];
    const orientationStyle = separatorVariants.orientation[orientation];

    // Calculate margins
    const marginStyles = {
        margin: margin,
        marginHorizontal: marginHorizontal,
        marginVertical: marginVertical,
    };

    // Apply separator styles
    const separatorStyle = {
        backgroundColor: color || variantStyle.backgroundColor,
        opacity: opacity ?? variantStyle.opacity, // Use custom opacity or variant's
        height: orientation === 'horizontal' ? thickness || orientationStyle.height : '100%',
        width: orientation === 'vertical' ? thickness || orientationStyle.width : '100%',
        borderRadius: orientationStyle.borderRadius,
        ...marginStyles,
    };

    return (
        <View
            // @ts-ignore
            style={[styles.separator, separatorStyle, style]}
            // @ts-ignore
            accessibilityRole="separator"
        />
    );
};

// Base styles
const styles = StyleSheet.create({
    separator: {
        flexShrink: 0,
    },
});

export { separatorVariants };