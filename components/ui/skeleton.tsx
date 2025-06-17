import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    useAnimatedStyle,
    Easing,
    interpolate,
    withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

export type AnimationType = 'shimmer' | 'wave' | 'pulse' | 'none';

// Define skeleton variants using theme colors
const skeletonVariants = {
    variant: {
        default: {
            backgroundColor: currentTheme.muted,               // Using theme.muted instead of '#e0e0e0'
            highlightColor: currentTheme.background,          // Using theme.background for highlight
        },
        subtle: {
            backgroundColor: currentTheme.accent,             // Using theme.accent for subtle variant
            highlightColor: currentTheme.background,          // Using theme.background for highlight
        },
        card: {
            backgroundColor: currentTheme.card,               // Using theme.card for card-like skeletons
            highlightColor: currentTheme.muted,               // Using theme.muted for highlight
        },
        text: {
            backgroundColor: currentTheme.mutedForeground,    // Using theme.mutedForeground for text-like skeletons
            highlightColor: currentTheme.muted,               // Using theme.muted for highlight
        },
    },
    size: {
        sm: {
            height: 16,
            borderRadius: radius.sm,                          // Using theme radius instead of hardcoded 4
        },
        md: {
            height: 20,
            borderRadius: radius.md,                          // Using theme radius
        },
        lg: {
            height: 24,
            borderRadius: radius.lg,                          // Using theme radius
        },
        xl: {
            height: 32,
            borderRadius: radius.xl,                          // Using theme radius
        },
    },
};

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
    backgroundColor?: string;
    highlightColor?: string;
    animationType?: AnimationType;
    duration?: number; // Custom duration in milliseconds
    variant?: keyof typeof skeletonVariants.variant;
    size?: keyof typeof skeletonVariants.size;
    opacity?: number; // Custom opacity for the skeleton
}

export const Skeleton = ({
    width = '100%',
    height,
    borderRadius,
    style,
    backgroundColor,
    highlightColor,
    animationType = 'shimmer',
    duration = 1200, // Default duration: 1.2 seconds
    variant = 'default',
    size = 'md',
    opacity = 1,
}: SkeletonProps) => {
    // Get variant and size styles
    const variantStyle = skeletonVariants.variant[variant];
    const sizeStyle = skeletonVariants.size[size];

    // Use theme colors or custom overrides
    const finalBackgroundColor = backgroundColor || variantStyle.backgroundColor;
    const finalHighlightColor = highlightColor || variantStyle.highlightColor;
    const finalHeight = height || sizeStyle.height;
    const finalBorderRadius = borderRadius !== undefined ? borderRadius : sizeStyle.borderRadius;

    // Animation progress value
    const animationValue = useSharedValue(0);

    React.useEffect(() => {
        // Reset animation value
        animationValue.value = 0;

        // Start the animation when component mounts
        switch (animationType) {
            case 'shimmer':
                animationValue.value = withRepeat(
                    withTiming(1, {
                        duration,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    }),
                    -1, // Infinite repeat
                    false // Don't reverse, we'll handle the loop ourselves
                );
                break;

            case 'wave':
                // Smooth wave effect
                const segmentDuration = duration / 6; // Divide duration into 6 segments
                animationValue.value = withRepeat(
                    withSequence(
                        withTiming(0.2, { duration: segmentDuration }),
                        withTiming(0.8, { duration: segmentDuration }),
                        withTiming(1, { duration: segmentDuration }),
                        withTiming(0.8, { duration: segmentDuration }),
                        withTiming(0.2, { duration: segmentDuration }),
                        withTiming(0, { duration: segmentDuration }),
                    ),
                    -1, // Infinite repeat
                    false
                );
                break;

            case 'pulse':
                // New pulse animation
                animationValue.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                    ),
                    -1, // Infinite repeat
                    false
                );
                break;

            case 'none':
            default:
                // No animation
                animationValue.value = 0;
                break;
        }
    }, [animationType, duration]);

    // Create the animated content based on animation type
    const getAnimatedContent = () => {
        switch (animationType) {
            case 'shimmer':
                // Create the animated style for the gradient position
                const shimmerStyle = useAnimatedStyle(() => {
                    // This will move the gradient from -1 (outside left) to 1 (outside right)
                    const translateX = interpolate(
                        animationValue.value,
                        [0, 1],
                        [-1, 1]
                    );

                    return {
                        transform: [{ translateX: `${translateX * 100}%` }],
                    };
                });

                return (
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            shimmerStyle,
                        ]}
                    >
                        <LinearGradient
                            style={{ flex: 1, width: '200%' }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[
                                'rgba(255, 255, 255, 0)', // Transparent
                                finalHighlightColor, // Highlight color from theme
                                'rgba(255, 255, 255, 0)', // Back to transparent
                            ]}
                            locations={[0.3, 0.5, 0.7]} // Concentrated in the middle
                        />
                    </Animated.View>
                );

            case 'wave':
                // For wave animation, we use opacity changes
                const waveStyle = useAnimatedStyle(() => {
                    return {
                        opacity: interpolate(
                            animationValue.value,
                            [0, 0.5, 1],
                            [0.4, 0.9, 0.4]
                        ),
                        backgroundColor: finalHighlightColor,
                    };
                });

                return (
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            waveStyle,
                        ]}
                    />
                );

            case 'pulse':
                // New pulse animation with scale and opacity
                const pulseStyle = useAnimatedStyle(() => {
                    const scale = interpolate(
                        animationValue.value,
                        [0, 1],
                        [0.95, 1.02]
                    );

                    const pulseOpacity = interpolate(
                        animationValue.value,
                        [0, 0.5, 1],
                        [0.6, 1, 0.6]
                    );

                    return {
                        transform: [{ scale }],
                        opacity: pulseOpacity,
                    };
                });

                return (
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            pulseStyle,
                            { backgroundColor: finalHighlightColor }
                        ]}
                    />
                );

            case 'none':
            default:
                return null;
        }
    };

    return (
        <View
            style={[
                {
                    width,
                    height: finalHeight,
                    borderRadius: finalBorderRadius,
                    backgroundColor: finalBackgroundColor,
                    overflow: 'hidden', // Important to clip the gradient
                    opacity,
                },
                style,
            ]}
        >
            {getAnimatedContent()}
        </View>
    );
};

// Predefined skeleton shapes for common use cases
export const SkeletonText = ({ lines = 3, ...props }: { lines?: number } & Partial<SkeletonProps>) => {
    return (
        <View style={{ gap: 8 }}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant="text"
                    size="sm"
                    width={index === lines - 1 ? '60%' : '100%'} // Last line is shorter
                    {...props}
                />
            ))}
        </View>
    );
};

// @ts-ignore
export const SkeletonCircle = ({ size = 40, ...props }: { size?: number } & Partial<SkeletonProps>) => {
    return (
        <Skeleton
            width={size}
            height={size}
            borderRadius={size / 2}
            variant="default"
            {...props}
        />
    );
};

export const SkeletonCard = ({ ...props }: Partial<SkeletonProps>) => {
    return (
        <View style={{ gap: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* @ts-ignore */}
                <SkeletonCircle size={40} {...props} />
                <View style={{ flex: 1, gap: 4 }}>
                    <Skeleton variant="text" size="md" width="70%" {...props} />
                    <Skeleton variant="text" size="sm" width="50%" {...props} />
                </View>
            </View>
            <Skeleton variant="card" height={120} {...props} />
            <SkeletonText lines={2} {...props} />
        </View>
    );
};

export { skeletonVariants };