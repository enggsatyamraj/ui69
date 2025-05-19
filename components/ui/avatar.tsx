import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle, Pressable } from 'react-native';

// Define avatarVariants
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
            backgroundColor: '#e2e8f0', // Light gray
            textColor: '#64748b',      // Slate gray
            borderWidth: 0,
            borderColor: 'transparent',
        },
        primary: {
            backgroundColor: '#eff6ff', // Light blue
            textColor: '#3b82f6',      // Blue
            borderWidth: 0,
            borderColor: 'transparent',
        },
        secondary: {
            backgroundColor: '#f1f5f9', // Light slate
            textColor: '#64748b',      // Slate gray
            borderWidth: 0,
            borderColor: 'transparent',
        },
        success: {
            backgroundColor: '#ecfdf5', // Light green
            textColor: '#10b981',      // Green
            borderWidth: 0,
            borderColor: 'transparent',
        },
        warning: {
            backgroundColor: '#fffbeb', // Light amber
            textColor: '#f59e0b',      // Amber
            borderWidth: 0,
            borderColor: 'transparent',
        },
        error: {
            backgroundColor: '#fef2f2', // Light red
            textColor: '#ef4444',      // Red
            borderWidth: 0,
            borderColor: 'transparent',
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: '#64748b',      // Slate gray
            borderWidth: 2,
            borderColor: '#e2e8f0',    // Light gray border
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
    statusBorderColor = '#ffffff',
    statusBorderWidth = 2,

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
                        backgroundColor: statusVariant.backgroundColor,
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
}

export const AvatarGroup = ({
    children,
    max = 4,
    spacing = -8,
    style,
    countStyle,
    countTextStyle,
    countBackgroundColor = '#e2e8f0',
    countTextColor = '#64748b',
    countBorderWidth = 2,
    countBorderColor = '#ffffff',
    countFontSize,
    countFontWeight = '600',
    expandable = false,
    onExpandChange,
    expandedSpacing = -4,
    initialExpanded = false,
}: AvatarGroupProps) => {
    const [isExpanded, setIsExpanded] = React.useState(initialExpanded);
    const childrenArray = React.Children.toArray(children);
    const totalAvatars = childrenArray.length;

    // Determine which avatars to show based on expanded state
    const visibleAvatars = isExpanded
        ? childrenArray
        : childrenArray.slice(0, max);

    const remainingCount = Math.max(0, totalAvatars - max);

    // Get the size from the first avatar to maintain consistency
    const firstAvatar = childrenArray[0] as React.ReactElement;
    // @ts-ignore
    const avatarSize = firstAvatar?.props?.size || 'md';

    // Handle toggle expand
    const handleToggleExpand = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        onExpandChange && onExpandChange(newExpandedState);
    };

    return (
        <View style={[styles.group, style]}>
            {visibleAvatars.map((child, index) => (
                <View
                    key={index}
                    style={{
                        zIndex: visibleAvatars.length - index,
                        marginLeft: index > 0 ? (isExpanded ? expandedSpacing : spacing) : 0
                    }}
                >
                    {child}
                </View>
            ))}

            {!isExpanded && remainingCount > 0 && (
                <View
                    style={[
                        {
                            zIndex: 0,
                            marginLeft: spacing
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

            {isExpanded && expandable && (
                <Pressable
                    onPress={handleToggleExpand}
                    style={[
                        styles.collapseButton,
                        {
                            marginLeft: expandedSpacing,
                        }
                    ]}
                >
                    <Avatar
                        size={avatarSize}
                        initials="−" // Minus sign for collapse
                        backgroundColor="#e2e8f0"
                        textColor="#64748b"
                        borderWidth={countBorderWidth}
                        borderColor={countBorderColor}
                    />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative', // For status indicator positioning
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
    group: {
        flexDirection: 'row',
        alignItems: 'center',
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