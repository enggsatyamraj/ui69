import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity, Pressable } from 'react-native';

// Define variants for the Card component
const cardVariants = {
    variant: {
        default: {
            backgroundColor: '#ffffff', // White
            borderColor: '#e2e8f0', // Light gray border
            borderWidth: 1,
            shadowOpacity: 0.1,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
        },
        warning: {
            backgroundColor: '#fef2f2', // Light red
            borderColor: '#fee2e2', // Lighter red border
            borderWidth: 1,
            shadowOpacity: 0.1,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
        },
        secondary: {
            backgroundColor: '#f8fafc', // Very light gray
            borderColor: '#e2e8f0', // Light gray border
            borderWidth: 1,
            shadowOpacity: 0.05,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
    },
};

export interface CardProps {
    children?: React.ReactNode;
    variant?: keyof typeof cardVariants.variant;
    style?: StyleProp<ViewStyle>;
    padding?: number | { horizontal?: number; vertical?: number }; // Custom padding
    borderRadius?: number; // Custom border radius
    borderTopLeftRadius?: number; // Custom border radius for specific corners
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    elevation?: number; // Custom elevation (Android)
    testID?: string; // For testing
    onPress?: () => void; // Make card pressable if provided
    accessibilityLabel?: string; // For screen readers
    accessibilityHint?: string; // Additional info for screen readers
    pressedOpacity?: number; // Opacity when pressed (0-1)
    disabled?: boolean; // Disable press events
}

export const Card = ({
    children,
    variant = 'default',
    style,
    padding = 16,
    borderRadius = 8,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    elevation,
    testID,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    pressedOpacity = 0.7,
    disabled = false,
}: CardProps) => {
    const variantStyle = cardVariants.variant[variant];
    const [isPressed, setIsPressed] = useState(false);

    // Determine padding values
    let paddingHorizontal;
    let paddingVertical;

    if (typeof padding === 'number') {
        paddingHorizontal = padding;
        paddingVertical = padding;
    } else if (padding) {
        paddingHorizontal = padding.horizontal;
        paddingVertical = padding.vertical;
    }

    // Apply card styles based on variant
    const cardStyle = {
        backgroundColor: variantStyle.backgroundColor,
        borderWidth: variantStyle.borderWidth,
        borderColor: variantStyle.borderColor,

        // Handle individual border radii if provided, otherwise use the global borderRadius
        borderRadius: borderRadius,
        borderTopLeftRadius: borderTopLeftRadius !== undefined ? borderTopLeftRadius : undefined,
        borderTopRightRadius: borderTopRightRadius !== undefined ? borderTopRightRadius : undefined,
        borderBottomLeftRadius: borderBottomLeftRadius !== undefined ? borderBottomLeftRadius : undefined,
        borderBottomRightRadius: borderBottomRightRadius !== undefined ? borderBottomRightRadius : undefined,

        shadowOpacity: variantStyle.shadowOpacity,
        shadowRadius: variantStyle.shadowRadius,
        shadowOffset: variantStyle.shadowOffset,
        shadowColor: '#000',
        elevation: elevation !== undefined ? elevation : (variantStyle.shadowOpacity ? 3 : 0), // Android shadow
        paddingHorizontal,
        paddingVertical,

        // Apply opacity when pressed
        opacity: isPressed ? pressedOpacity : 1,
    };

    // If onPress is provided, make the card pressable
    if (onPress) {
        return (
            <Pressable
                style={[styles.card, cardStyle, style]}
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                disabled={disabled}
                testID={testID}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityState={{ disabled }}
            >
                {children}
            </Pressable>
        );
    }

    // Otherwise, render as a regular View
    return (
        <View
            style={[styles.card, cardStyle, style]}
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="none"
        >
            {children}
        </View>
    );
};

// Sub-components for the Card
export const CardHeader = ({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}) => (
    <View style={[styles.cardHeader, style]}>{children}</View>
);

export const CardContent = ({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}) => (
    <View style={[styles.cardContent, style]}>{children}</View>
);

export const CardFooter = ({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}) => (
    <View style={[styles.cardFooter, style]}>{children}</View>
);

// Base styles
const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
    cardHeader: {
        marginBottom: 8,
    },
    cardContent: {
        // Default styles for content
    },
    cardFooter: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

export { cardVariants };