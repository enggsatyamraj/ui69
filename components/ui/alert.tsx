import React, { createContext, useContext } from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Define alert variants using theme colors
const alertVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            textColor: currentTheme.foreground,
            iconColor: currentTheme.foreground,
        },
        destructive: {
            backgroundColor: '#fef2f2', // Light red background
            borderColor: currentTheme.destructive,
            textColor: currentTheme.destructive,
            iconColor: currentTheme.destructive,
        },
        success: {
            backgroundColor: '#f0fdf4', // Light green background
            borderColor: '#22c55e', // Green-500
            textColor: '#15803d', // Green-700
            iconColor: '#22c55e',
        },
        warning: {
            backgroundColor: '#fffbeb', // Light amber background
            borderColor: '#f59e0b', // Amber-500
            textColor: '#d97706', // Amber-600
            iconColor: '#f59e0b',
        },
        info: {
            backgroundColor: '#eff6ff', // Light blue background
            borderColor: '#3b82f6', // Blue-500
            textColor: '#1d4ed8', // Blue-700
            iconColor: '#3b82f6',
        },
        muted: {
            backgroundColor: currentTheme.muted,
            borderColor: currentTheme.border,
            textColor: currentTheme.mutedForeground,
            iconColor: currentTheme.mutedForeground,
        },
    },
};

// Types
interface AlertContextType {
    variant: keyof typeof alertVariants.variant;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Hook to use alert context
const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an Alert component');
    }
    return context;
};

// Main Alert component
export interface AlertProps {
    children: React.ReactNode;
    variant?: keyof typeof alertVariants.variant;
    style?: StyleProp<ViewStyle>;
    borderRadius?: number;
    borderWidth?: number;
    padding?: number | { horizontal?: number; vertical?: number };
    // Custom colors
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    iconColor?: string;
    // Shadow
    shadow?: boolean;
    elevation?: number;
}

export const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'default',
    style,
    borderRadius = radius.lg,
    borderWidth = 1,
    padding = 16,
    backgroundColor,
    borderColor,
    textColor,
    iconColor,
    shadow = false,
    elevation = 2,
}) => {
    const variantStyle = alertVariants.variant[variant];

    // Handle padding
    let paddingHorizontal, paddingVertical;
    if (typeof padding === 'number') {
        paddingHorizontal = padding;
        paddingVertical = padding;
    } else {
        paddingHorizontal = padding.horizontal || 16;
        paddingVertical = padding.vertical || 16;
    }

    // Build alert styles
    const alertStyle = {
        backgroundColor: backgroundColor || variantStyle.backgroundColor,
        borderColor: borderColor || variantStyle.borderColor,
        borderWidth,
        borderRadius,
        paddingHorizontal,
        paddingVertical,
        shadowColor: shadow ? '#000' : undefined,
        shadowOffset: shadow ? { width: 0, height: 1 } : undefined,
        shadowOpacity: shadow ? 0.1 : undefined,
        shadowRadius: shadow ? 2 : undefined,
        elevation: shadow ? elevation : 0,
    };

    const contextValue: AlertContextType = {
        variant,
    };

    return (
        <AlertContext.Provider value={contextValue}>
            <View style={[styles.alert, alertStyle, style]}>
                {children}
            </View>
        </AlertContext.Provider>
    );
};

// AlertTitle component
export interface AlertTitleProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    fontSize?: number;
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    color?: string;
    numberOfLines?: number;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
    children,
    style,
    fontSize = 16,
    fontWeight = '600',
    color,
    numberOfLines,
}) => {
    const { variant } = useAlert();
    const variantStyle = alertVariants.variant[variant];

    const titleStyle = {
        color: color || variantStyle.textColor,
        fontSize,
        fontWeight,
        lineHeight: Math.round(fontSize * 1.4), // 1.4x line height for good readability
    };

    return (
        <Text
            style={[styles.title, titleStyle, style]}
            numberOfLines={numberOfLines}
            accessibilityRole="header"
        >
            {children}
        </Text>
    );
};

// AlertDescription component
export interface AlertDescriptionProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    fontSize?: number;
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    color?: string;
    numberOfLines?: number;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
    children,
    style,
    fontSize = 14,
    fontWeight = '400',
    color,
    numberOfLines,
}) => {
    const { variant } = useAlert();
    const variantStyle = alertVariants.variant[variant];

    const descriptionStyle = {
        color: color || variantStyle.textColor,
        fontSize,
        fontWeight,
        lineHeight: Math.round(fontSize * 1.5), // 1.5x line height for descriptions
        opacity: 0.8, // Slightly muted for hierarchy
    };

    return (
        <Text
            style={[styles.description, descriptionStyle, style]}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    );
};

// AlertIcon component (for custom icons)
export interface AlertIconProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    size?: number;
    color?: string;
}

export const AlertIcon: React.FC<AlertIconProps> = ({
    children,
    style,
    size = 20,
    color,
}) => {
    const { variant } = useAlert();
    const variantStyle = alertVariants.variant[variant];

    const iconContainerStyle = {
        width: size,
        height: size,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    };

    return (
        <View style={[styles.iconContainer, iconContainerStyle, style]}>
            {children}
        </View>
    );
};

// AlertContent component (for when you have both icon and content)
export interface AlertContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const AlertContent: React.FC<AlertContentProps> = ({
    children,
    style,
}) => {
    return (
        <View style={[styles.content, style]}>
            {children}
        </View>
    );
};

// AlertActions component (for buttons or action elements)
export interface AlertActionsProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    direction?: 'row' | 'column';
    spacing?: number;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export const AlertActions: React.FC<AlertActionsProps> = ({
    children,
    style,
    direction = 'row',
    spacing = 8,
    align = 'flex-end',
}) => {
    const actionsStyle = {
        flexDirection: direction,
        gap: spacing,
        alignItems: align,
    };

    return (
        <View style={[styles.actions, actionsStyle, style]}>
            {children}
        </View>
    );
};

// Pre-built alert variants for common use cases
export const SuccessAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
    <Alert {...props} variant="success" />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
    <Alert {...props} variant="destructive" />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
    <Alert {...props} variant="warning" />
);

export const InfoAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
    <Alert {...props} variant="info" />
);

const styles = StyleSheet.create({
    alert: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconContainer: {
        marginTop: 2, // Slight offset to align with text baseline
        flexShrink: 0,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    title: {
        includeFontPadding: false,
    },
    description: {
        includeFontPadding: false,
    },
    actions: {
        marginTop: 12,
    },
});

export { alertVariants };
