import React from 'react';
import { View, StyleSheet } from 'react-native';

// Define variants for the Separator component with darker colors
const separatorVariants = {
    variant: {
        default: {
            backgroundColor: '#64748b', // Dark slate
            opacity: 0.9, // Subtle opacity for polish
        },
        subtle: {
            backgroundColor: '#94a3b8', // Muted slate
            opacity: 0.7, // Lighter opacity
        },
        strong: {
            backgroundColor: '#1e293b', // Dark navy slate
            opacity: 1, // Full opacity for emphasis
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
}

export const Separator = ({
    variant = 'default',
    orientation = 'horizontal',
    style,
    thickness,
    color,
    opacity,
}: SeparatorProps) => {
    const variantStyle = separatorVariants.variant[variant];
    const orientationStyle = separatorVariants.orientation[orientation];

    // Apply separator styles
    const separatorStyle = {
        backgroundColor: color || variantStyle.backgroundColor,
        opacity: opacity ?? variantStyle.opacity, // Use custom opacity or variant's
        height: orientation === 'horizontal' ? thickness || orientationStyle.height : '100%',
        width: orientation === 'vertical' ? thickness || orientationStyle.width : '100%',
        borderRadius: orientationStyle.borderRadius,
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