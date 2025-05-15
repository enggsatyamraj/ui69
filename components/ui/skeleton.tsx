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

export type AnimationType = 'shimmer' | 'wave' | 'none';

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
    backgroundColor?: string;
    highlightColor?: string;
    animationType?: AnimationType;
    duration?: number; // Custom duration in milliseconds
}

export const Skeleton = ({
    width = '100%',
    height = 16,
    borderRadius = 4,
    style,
    backgroundColor = '#e0e0e0',
    highlightColor = 'rgba(255, 255, 255, 0.5)',
    animationType = 'shimmer',
    duration = 1200, // Default duration: 1.2 seconds
}: SkeletonProps) => {
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
                                highlightColor, // Highlight color
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
                        backgroundColor: highlightColor,
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
                    height,
                    borderRadius,
                    backgroundColor,
                    overflow: 'hidden', // Important to clip the gradient
                },
                style,
            ]}
        >
            {getAnimatedContent()}
        </View>
    );
};

