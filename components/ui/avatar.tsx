import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    ImageStyle,
    Pressable,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
// Import our theme
import { currentTheme, radius } from '../../theme.config';

// Define avatarVariants using theme colors
const avatarVariants = {
    size: {
        xs: {
            width: 24,
            height: 24,
            borderRadius: 12,
            fontSize: 10,
        },
        sm: {
            width: 32,
            height: 32,
            borderRadius: 16,
            fontSize: 12,
        },
        md: {
            width: 40,
            height: 40,
            borderRadius: 20,
            fontSize: 16,
        },
        lg: {
            width: 56,
            height: 56,
            borderRadius: 28,
            fontSize: 20,
        },
        xl: {
            width: 72,
            height: 72,
            borderRadius: 36,
            fontSize: 28,
        },
        '2xl': {
            width: 96,
            height: 96,
            borderRadius: 48,
            fontSize: 36,
        },
    },
    variant: {
        default: {
            backgroundColor: currentTheme.muted,               // Using theme.muted instead of '#e2e8f0'
            textColor: currentTheme.mutedForeground,          // Using theme.mutedForeground instead of '#64748b'
            borderWidth: 0,
            borderColor: 'transparent',
        },
        primary: {
            backgroundColor: currentTheme.primary,             // Using theme.primary instead of '#eff6ff'
            textColor: currentTheme.primaryForeground,        // Using theme.primaryForeground instead of '#3b82f6'
            borderWidth: 0,
            borderColor: 'transparent',
        },
        secondary: {
            backgroundColor: currentTheme.secondary,           // Using theme.secondary instead of '#f1f5f9'
            textColor: currentTheme.secondaryForeground,      // Using theme.secondaryForeground instead of '#64748b'
            borderWidth: 0,
            borderColor: 'transparent',
        },
        success: {
            backgroundColor: '#ecfdf5',                        // Light green (keep as is, theme doesn't have success colors)
            textColor: '#10b981',                              // Green (keep as is)
            borderWidth: 0,
            borderColor: 'transparent',
        },
        warning: {
            backgroundColor: '#fffbeb',                        // Light amber (keep as is)
            textColor: '#f59e0b',                              // Amber (keep as is)
            borderWidth: 0,
            borderColor: 'transparent',
        },
        error: {
            backgroundColor: '#fef2f2',                        // Light red (keep as is, close to destructive)
            textColor: currentTheme.destructive,              // Using theme.destructive instead of '#ef4444'
            borderWidth: 0,
            borderColor: 'transparent',
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: currentTheme.foreground,               // Using theme.foreground instead of '#64748b'
            borderWidth: 2,
            borderColor: currentTheme.border,                 // Using theme.border instead of '#e2e8f0'
        },
    },
};

export interface AvatarProps {
    // Core props
    size?: keyof typeof avatarVariants.size;
    variant?: keyof typeof avatarVariants.variant;

    // Image options
    source?: any;     // Image source for Image component
    defaultSource?: any; // Fallback for when main source fails to load

    // Alternative content
    alt?: string;     // Alternative text for accessibility
    initials?: string; // Text to display when no image (usually initials)
    fallback?: React.ReactNode; // Custom fallback component

    // Styling
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    textStyle?: StyleProp<TextStyle>;
    shape?: 'circle' | 'square'; // Shape of the avatar

    // Customization
    backgroundColor?: string;
    textColor?: string;
    borderWidth?: number;
    borderColor?: string;

    // Font styling
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    fontStyle?: "normal" | "italic";
    fontFamily?: string;
    fontSize?: number;
    letterSpacing?: number;
    textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";

    // Status indicator
    status?: keyof typeof avatarVariants.variant | null;
    statusSize?: number;
    statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    statusBorderColor?: string;
    statusBorderWidth?: number;
    statusBackgroundColor?: string; // New: Custom background color for status indicator

    // Other
    testID?: string;
    onError?: () => void;
    onLoad?: () => void;
    onPress?: () => void;
}

export const Avatar = ({
    // Core props
    size = 'md',
    variant = 'default',

    // Image options
    source,
    defaultSource,

    // Alternative content
    alt,
    initials,
    fallback,

    // Styling
    style,
    imageStyle,
    textStyle,
    shape = 'circle',

    // Customization
    backgroundColor,
    textColor,
    borderWidth,
    borderColor,

    // Font styling
    fontWeight = '600',
    fontStyle,
    fontFamily,
    fontSize,
    letterSpacing,
    textTransform,

    // Status indicator
    status = null,
    statusSize,
    statusPosition = 'bottom-right',
    statusBorderColor = currentTheme.background,        // Using theme.background instead of '#ffffff'
    statusBorderWidth = 2,
    statusBackgroundColor,

    // Other
    testID,
    onError,
    onLoad,
    onPress,
}: AvatarProps) => {
    const [imageError, setImageError] = React.useState(!source);
    const sizeStyle = avatarVariants.size[size];
    const variantStyle = avatarVariants.variant[variant];

    // Handle image load error
    const handleImageError = () => {
        setImageError(true);
        onError && onError();
    };

    // Handle image load success
    const handleImageLoad = () => {
        onLoad && onLoad();
    };

    // Calculate appropriate status indicator size
    const getStatusSize = () => {
        if (statusSize) return statusSize;

        // Default size based on avatar size
        const sizeFactor = {
            xs: 6,
            sm: 8,
            md: 10,
            lg: 12,
            xl: 14,
            '2xl': 16,
        };

        return sizeFactor[size];
    };

    // Calculate styles
    const containerStyle = {
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: shape === 'circle' ? sizeStyle.borderRadius : sizeStyle.width * 0.16, // Square with slight rounding
        backgroundColor: backgroundColor || variantStyle.backgroundColor,
        borderWidth: borderWidth !== undefined ? borderWidth : variantStyle.borderWidth,
        borderColor: borderColor || variantStyle.borderColor,
    };

    const initialsStyle = {
        color: textColor || variantStyle.textColor,
        fontSize: fontSize || sizeStyle.fontSize,
        fontWeight,
        fontStyle,
        fontFamily,
        letterSpacing,
        textTransform,
    };

    // Status indicator positioning
    const statusPositioning = {
        'top-right': { top: -2, right: -2 },
        'top-left': { top: -2, left: -2 },
        'bottom-right': { bottom: -2, right: -2 },
        'bottom-left': { bottom: -2, left: -2 },
    };

    // Handle rendering based on what's provided
    const renderContent = () => {
        // If there's an image source and no error, render the image
        if (source && !imageError) {
            return (
                <Image
                    source={source}
                    defaultSource={defaultSource}
                    style={[styles.image, imageStyle]}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    accessibilityLabel={alt}
                    testID={`${testID}-image`}
                />
            );
        }

        // If there's a custom fallback, render it
        if (fallback) {
            return fallback;
        }

        // Otherwise, render initials if provided
        if (initials) {
            return (
                <Text
                    style={[styles.initials, initialsStyle, textStyle]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    testID={`${testID}-initials`}
                >
                    {initials}
                </Text>
            );
        }

        // Default fallback: render a placeholder icon
        return (
            <View style={styles.placeholderIcon} testID={`${testID}-placeholder`}>
                {/* Simple person icon shape made with View elements */}
                <View style={[styles.placeholderHead, { backgroundColor: textColor || variantStyle.textColor }]} />
                <View style={[styles.placeholderBody, { backgroundColor: textColor || variantStyle.textColor }]} />
            </View>
        );
    };

    // Render status indicator if provided
    const renderStatus = () => {
        if (!status) return null;

        const statusVariant = avatarVariants.variant[status];
        const currentStatusSize = getStatusSize();

        return (
            <View
                style={[
                    styles.statusIndicator,
                    {
                        width: currentStatusSize,
                        height: currentStatusSize,
                        borderRadius: currentStatusSize / 2,
                        backgroundColor: statusBackgroundColor || statusVariant.backgroundColor,
                        borderColor: statusBorderColor,
                        borderWidth: statusBorderWidth,
                        ...statusPositioning[statusPosition],
                    },
                ]}
                testID={`${testID}-status`}
            />
        );
    };

    // If onPress is provided, wrap with Pressable
    const AvatarContent = () => (
        <View
            style={[styles.avatarContainer, containerStyle]}
            accessibilityRole="image"
            accessibilityLabel={alt || "Avatar"}
        >
            {renderContent()}
        </View>
    );

    return (
        <View
            style={[styles.container, style]}
            testID={testID}
        >
            {onPress ? (
                <Pressable onPress={onPress}>
                    <AvatarContent />
                </Pressable>
            ) : (
                <AvatarContent />
            )}
            {renderStatus()}
        </View>
    );
};

// Avatar group component to display multiple avatars with overlap
export interface AvatarGroupProps {
    // Core props
    children: React.ReactNode[];
    max?: number; // Maximum number of avatars to show before displaying a count

    // Styling
    spacing?: number; // Negative spacing between avatars (overlap)
    style?: StyleProp<ViewStyle>;

    // Count styling
    countStyle?: StyleProp<ViewStyle>;
    countTextStyle?: StyleProp<TextStyle>;

    // Count avatar styling matches Avatar props
    countBackgroundColor?: string;
    countTextColor?: string;
    countBorderWidth?: number;
    countBorderColor?: string;
    countFontSize?: number;
    countFontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

    // Expandable feature
    expandable?: boolean; // Whether the avatar group can expand to show all avatars
    onExpandChange?: (isExpanded: boolean) => void; // Callback when expanded state changes
    expandedSpacing?: number; // Spacing when expanded (can be different from collapsed)
    initialExpanded?: boolean; // Whether the group is initially expanded

    // Animation options
    animationDuration?: number; // Duration of the animation in ms
    useAnimation?: boolean; // Whether to use animation for expanding/collapsing
    animationType?: 'spring' | 'timing'; // Type of animation to use

    // Layout options
    allowWrap?: boolean; // Allow avatars to wrap to multiple lines
    maxWidth?: number; // Maximum width of the container before wrapping
    rowSpacing?: number; // Spacing between rows when wrapping
}

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export const AvatarGroup = ({
    children,
    max = 4,
    spacing = -8,
    style,
    countStyle,
    countTextStyle,
    countBackgroundColor = currentTheme.muted,              // Using theme.muted instead of '#e2e8f0'
    countTextColor = currentTheme.mutedForeground,          // Using theme.mutedForeground instead of '#64748b'
    countBorderWidth = 2,
    countBorderColor = currentTheme.background,             // Using theme.background instead of '#ffffff'
    countFontSize,
    countFontWeight = '600',
    expandable = false,
    onExpandChange,
    expandedSpacing = -4,
    initialExpanded = false,
    animationDuration = 300,
    useAnimation = true,
    animationType = 'spring',
    allowWrap = false, // Whether to allow wrapping to next line
    maxWidth, // Maximum width of the container before wrapping
    rowSpacing = 8, // Spacing between rows when wrapping
}: AvatarGroupProps) => {
    const [isExpanded, setIsExpanded] = React.useState(initialExpanded);
    const childrenArray = React.Children.toArray(children);
    const totalAvatars = childrenArray.length;

    // Animation values
    const animatedValues = React.useRef(
        childrenArray.map(() => new Animated.Value(0))
    ).current;
    const opacityValues = React.useRef(
        childrenArray.map(() => new Animated.Value(0))
    ).current;

    // Update animation values when children change
    React.useEffect(() => {
        if (animatedValues.length !== childrenArray.length) {
            const newAnimatedValues = childrenArray.map((_, i) =>
                i < animatedValues.length ? animatedValues[i] : new Animated.Value(0)
            );

            const newOpacityValues = childrenArray.map((_, i) =>
                i < opacityValues.length ? opacityValues[i] : new Animated.Value(0)
            );

            animatedValues.splice(0, animatedValues.length, ...newAnimatedValues);
            opacityValues.splice(0, opacityValues.length, ...newOpacityValues);
        }
    }, [childrenArray.length]);

    // Determine which avatars to show based on expanded state
    const visibleCount = isExpanded ? childrenArray.length : Math.min(max, childrenArray.length);
    const visibleAvatars = childrenArray.slice(0, visibleCount);
    const remainingCount = Math.max(0, totalAvatars - max);

    // Get the size from the first avatar to maintain consistency
    const firstAvatar = childrenArray[0] as React.ReactElement;
    // @ts-ignore
    const avatarSize = firstAvatar?.props?.size || 'md';
    // @ts-ignore
    const avatarWidth = avatarVariants.size[avatarSize].width;

    // Handle toggle expand with animation
    const handleToggleExpand = () => {
        if (useAnimation) {
            // Using LayoutAnimation for a smoother overall transition
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    animationDuration,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity
                )
            );

            // Animated entrance for each avatar
            const animations = [];

            if (!isExpanded) {
                // Expanding: animate additional avatars into view
                for (let i = max; i < childrenArray.length; i++) {
                    // Reset values - start from left side (negative X value)
                    // The further the avatar is in the list, the further left it starts
                    const startPosition = -30 - ((i - max) * 10);
                    animatedValues[i].setValue(startPosition);
                    opacityValues[i].setValue(0);

                    // Create animations
                    const translateAnim = Animated[animationType](animatedValues[i], {
                        toValue: 0,
                        duration: animationDuration,
                        useNativeDriver: true,
                        tension: 120,
                        friction: 8,
                        delay: (i - max) * 50, // Staggered animation for each avatar
                    });

                    const opacityAnim = Animated.timing(opacityValues[i], {
                        toValue: 1,
                        duration: animationDuration * 0.6,
                        useNativeDriver: true,
                        delay: (i - max) * 50, // Match the delay with translate animation
                    });

                    animations.push(translateAnim);
                    animations.push(opacityAnim);
                }

                // Start all animations
                Animated.parallel(animations).start();
            }
        }

        // Update state
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        onExpandChange && onExpandChange(newExpandedState);
    };

    // Calculate effective spacing
    const effectiveSpacing = isExpanded ? expandedSpacing : spacing;

    // Function to create rows of avatars for wrapping
    const createRows = () => {
        if (!allowWrap) {
            // If wrapping is not allowed, return a single row
            return [visibleAvatars];
        }

        const rows = [];
        // @ts-ignore
        let currentRow = [];
        let currentRowWidth = 0;

        // Calculate the effective max width
        const containerMaxWidth = maxWidth || 350; // Default fallback width if not specified

        // Adjust for available space
        const availableWidth = containerMaxWidth;

        // Process each visible avatar
        visibleAvatars.forEach((child, index) => {
            // For the first item in a row, no spacing is applied
            const itemSpacing = currentRow.length > 0 ? effectiveSpacing : 0;
            const itemWidth = avatarWidth + itemSpacing;

            // Check if adding this item would exceed the available width
            if (currentRow.length > 0 && currentRowWidth + itemWidth > availableWidth) {
                // This item starts a new row
                // @ts-ignore
                rows.push([...currentRow]);
                currentRow = [child];
                currentRowWidth = avatarWidth;
            } else {
                // Add to current row
                currentRow.push(child);
                currentRowWidth += itemWidth;
            }
        });

        // Add the last row if it has items
        if (currentRow.length > 0) {
            // @ts-ignore
            rows.push(currentRow);
        }

        return rows;
    };

    // Generate rows based on wrapping logic
    const avatarRows = createRows();

    return (
        <View style={[styles.container, style]}>
            {avatarRows.map((row, rowIndex) => (
                <View
                    key={`row-${rowIndex}`}
                    style={[
                        styles.row,
                        { marginTop: rowIndex > 0 ? rowSpacing : 0 }
                    ]}
                >
                    {/* Render avatars in this row */}
                    {row.map((child, index) => {
                        const actualIndex = rowIndex === 0
                            ? index
                            : avatarRows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + index;

                        // Determine if this is an additional avatar (shown when expanded)
                        const isAdditionalAvatar = actualIndex >= max;

                        // For expanded additional avatars
                        if (isExpanded && isAdditionalAvatar) {
                            return (
                                <Animated.View
                                    key={`expanded-avatar-${actualIndex}`}
                                    style={[
                                        {
                                            zIndex: (childrenArray.length - actualIndex) * -1,
                                            marginLeft: index > 0 ? effectiveSpacing : 0,
                                            opacity: useAnimation ? opacityValues[actualIndex] : 1,
                                            transform: [
                                                {
                                                    translateX: useAnimation ? animatedValues[actualIndex] : 0
                                                }
                                            ],
                                        }
                                    ]}
                                >
                                    {child}
                                </Animated.View>
                            );
                        }

                        // For regular avatars
                        return (
                            <View
                                key={`avatar-${actualIndex}`}
                                style={{
                                    zIndex: childrenArray.length - actualIndex,
                                    marginLeft: index > 0 ? effectiveSpacing : 0
                                }}
                            >
                                {child}
                            </View>
                        );
                    })}

                    {/* Show count avatar at the end of the last visible row if needed */}
                    {rowIndex === avatarRows.length - 1 && !isExpanded && remainingCount > 0 && (
                        <View
                            style={[
                                {
                                    zIndex: 0,
                                    marginLeft: row.length > 0 ? effectiveSpacing : 0
                                },
                            ]}
                        >
                            <Pressable onPress={expandable ? handleToggleExpand : undefined}>
                                <Avatar
                                    size={avatarSize}
                                    initials={`+${remainingCount}`}
                                    backgroundColor={countBackgroundColor}
                                    textColor={countTextColor}
                                    borderWidth={countBorderWidth}
                                    borderColor={countBorderColor}
                                    fontSize={countFontSize}
                                    fontWeight={countFontWeight}
                                    style={countStyle}
                                    textStyle={countTextStyle}
                                />
                            </Pressable>
                        </View>
                    )}

                    {/* Show collapse button on the last row when expanded */}
                    {rowIndex === avatarRows.length - 1 && isExpanded && expandable && (
                        <Pressable
                            onPress={handleToggleExpand}
                            style={[
                                styles.collapseButton,
                                {
                                    marginLeft: row.length > 0 ? effectiveSpacing : 0,
                                    zIndex: 0,
                                }
                            ]}
                        >
                            <Avatar
                                size={avatarSize}
                                initials="−" // Minus sign for collapse
                                backgroundColor={currentTheme.muted}           // Using theme.muted instead of '#e2e8f0'
                                textColor={currentTheme.mutedForeground}      // Using theme.mutedForeground instead of '#64748b'
                                borderWidth={countBorderWidth}
                                borderColor={countBorderColor}
                            />
                        </Pressable>
                    )}
                </View>
            ))}
        </View>
    );
};

// Update styles to support wrapping
const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start', // Important for wrapping
        flexDirection: 'column',
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    initials: {
        textAlign: 'center',
        includeFontPadding: false,
    },
    placeholderIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '65%',
        height: '65%',
    },
    placeholderHead: {
        width: '50%',
        height: '50%',
        borderRadius: 100,
        marginBottom: '10%',
    },
    placeholderBody: {
        width: '80%',
        height: '60%',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
    },
    statusIndicator: {
        position: 'absolute',
        zIndex: 1,
    },
    collapseButton: {
        zIndex: 0,
    },
});

export { avatarVariants };