import React, { createContext, useContext, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// Define accordion variants
const accordionVariants = {
    variant: {
        default: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            textColor: '#0f172a',
            headerBackgroundColor: '#f8fafc',
            iconColor: '#64748b',
        },
        outline: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            textColor: '#0f172a',
            headerBackgroundColor: 'transparent',
            iconColor: '#64748b',
        },
        filled: {
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0',
            textColor: '#0f172a',
            headerBackgroundColor: '#f1f5f9',
            iconColor: '#64748b',
        },
    },
    size: {
        sm: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 13,
            iconSize: 10,
            borderRadius: 6,
            gap: 8,
        },
        md: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 14,
            iconSize: 10,
            borderRadius: 8,
            gap: 10,
        },
        lg: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            fontSize: 16,
            iconSize: 12,
            borderRadius: 10,
            gap: 12,
        },
    },
};

// Create contexts for state handling
type AccordionContextType = {
    type: 'single' | 'multiple';
    value: string | string[] | undefined;
    onChange: (value: string) => void;
    collapsible: boolean;
    variant: keyof typeof accordionVariants.variant;
    size: keyof typeof accordionVariants.size;
    iconPosition: 'left' | 'right';
    animationDuration: number;
    showIcon: boolean;
    iconColor?: string;
};

type AccordionItemContextType = {
    value: string;
    open: boolean;
    toggle: () => void;
    disabled: boolean;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

// Hooks to consume the contexts
const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('useAccordion must be used within an Accordion component');
    }
    return context;
};

const useAccordionItem = () => {
    const context = useContext(AccordionItemContext);
    if (!context) {
        throw new Error('useAccordionItem must be used within an AccordionItem component');
    }
    return context;
};

// Main Accordion component
export interface AccordionProps {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: keyof typeof accordionVariants.variant;
    size?: keyof typeof accordionVariants.size;
    iconPosition?: 'left' | 'right';
    animationDuration?: number;
    showIcon?: boolean;
    spacing?: number;
    iconColor?: string;
}

export const Accordion = ({
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    children,
    style,
    variant = 'default',
    size = 'md',
    iconPosition = 'right',
    animationDuration = 300,
    showIcon = true,
    spacing = 0,
    iconColor,
}: AccordionProps) => {
    // State for uncontrolled component
    const [internalValue, setInternalValue] = useState<string | string[]>(
        // @ts-ignore
        defaultValue || (type === 'multiple' ? [] : undefined)
    );

    // Determine if using controlled or uncontrolled state
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Handle value change
    const handleValueChange = (itemValue: string) => {
        // For controlled component, call the provided onChange
        if (isControlled) {
            if (type === 'single') {
                // @ts-ignore
                onValueChange?.(currentValue === itemValue && collapsible ? undefined : itemValue);
            } else {
                const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
                const index = newValue.indexOf(itemValue);

                if (index >= 0) {
                    newValue.splice(index, 1);
                } else {
                    newValue.push(itemValue);
                }

                onValueChange?.(newValue);
            }
        } else {
            // For uncontrolled component, update internal state
            if (type === 'single') {
                // @ts-ignore
                setInternalValue(currentValue === itemValue && collapsible ? undefined : itemValue);
            } else {
                const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
                const index = newValue.indexOf(itemValue);

                if (index >= 0) {
                    newValue.splice(index, 1);
                } else {
                    newValue.push(itemValue);
                }

                setInternalValue(newValue);
            }
        }
    };

    // Apply spacing to children
    const renderChildren = () => {
        if (spacing <= 0) return children;

        return React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            return React.cloneElement(child, {
                // @ts-ignore
                style: [
                    // @ts-ignore
                    child.props.style,
                    index > 0 ? { marginTop: spacing } : null,
                ],
            });
        });
    };

    return (
        <AccordionContext.Provider
            value={{
                type,
                value: currentValue,
                onChange: handleValueChange,
                collapsible,
                variant,
                size,
                iconPosition,
                animationDuration,
                showIcon,
                iconColor,
            }}
        >
            <View style={[styles.accordion, style]}>
                {renderChildren()}
            </View>
        </AccordionContext.Provider>
    );
};

// AccordionItem component
export interface AccordionItemProps {
    children: React.ReactNode;
    value: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const AccordionItem = ({
    children,
    value,
    disabled = false,
    style,
}: AccordionItemProps) => {
    const { type, value: accordionValue, onChange, collapsible } = useAccordion();

    // Determine if this item is open
    const isOpen = type === 'single'
        ? accordionValue === value
        : Array.isArray(accordionValue) && accordionValue.includes(value);

    // Toggle open state
    const toggle = () => {
        if (disabled) return;
        onChange(value);
    };

    return (
        <AccordionItemContext.Provider
            value={{
                value,
                open: isOpen,
                toggle,
                disabled,
            }}
        >
            <View style={[styles.item, style, disabled && styles.disabled]}>
                {children}
            </View>
        </AccordionItemContext.Provider>
    );
};

// AccordionTrigger component
export interface AccordionTriggerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const AccordionTrigger = ({
    children,
    style,
    textStyle,
}: AccordionTriggerProps) => {
    const { open, toggle, disabled } = useAccordionItem();
    const { variant, size, iconPosition, animationDuration, showIcon, iconColor } = useAccordion();

    // Animation for chevron rotation
    const rotateAnim = useRef(new Animated.Value(open ? 1 : 0)).current;

    // Apply styles from variants
    const variantStyle = accordionVariants.variant[variant];
    const sizeStyle = accordionVariants.size[size];

    // Trigger animation when open state changes
    React.useEffect(() => {
        // Configure layout animation for smooth content transition
        LayoutAnimation.configureNext({
            duration: animationDuration,
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
        });

        // Animate chevron rotation
        Animated.timing(rotateAnim, {
            toValue: open ? 1 : 0,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    }, [open, animationDuration, rotateAnim]);

    // Interpolate rotation for chevron
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // Render chevron icon
    const renderChevron = () => {
        if (!showIcon) return null;

        return (
            <Animated.View
                style={{
                    transform: [{ rotate }],
                }}
            >
                <View style={[
                    styles.chevron,
                    {
                        borderColor: iconColor || variantStyle.iconColor,
                        width: sizeStyle.iconSize,
                        height: sizeStyle.iconSize,
                    }
                ]} />
            </Animated.View>
        );
    };

    // Styling
    const triggerStyles = {
        backgroundColor: variantStyle.headerBackgroundColor,
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
    };

    const labelStyles = {
        color: variantStyle.textColor,
        fontSize: sizeStyle.fontSize,
        fontWeight: '500' as const,
    };

    return (
        <Pressable
            style={[
                styles.trigger,
                triggerStyles,
                iconPosition === 'left' && styles.triggerIconLeft,
                style,
            ]}
            onPress={toggle}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ expanded: open, disabled }}
            accessibilityHint={`Tap to ${open ? 'collapse' : 'expand'} content`}
        >
            {iconPosition === 'left' && renderChevron()}

            {typeof children === 'string' ? (
                <Text style={[styles.triggerText, labelStyles, textStyle]}>
                    {children}
                </Text>
            ) : (
                children
            )}

            {iconPosition === 'right' && renderChevron()}
        </Pressable>
    );
};

// AccordionContent component
export interface AccordionContentProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const AccordionContent = ({
    children,
    style,
}: AccordionContentProps) => {
    const { open } = useAccordionItem();
    const { variant, size } = useAccordion();

    const variantStyle = accordionVariants.variant[variant];
    const sizeStyle = accordionVariants.size[size];

    // Don't render if not open
    if (!open) return null;

    const contentStyles = {
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
    };

    return (
        <View style={[styles.content, contentStyles, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    accordion: {
        width: '100%',
    },
    item: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 2,
    },
    disabled: {
        opacity: 0.6,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    triggerIconLeft: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
    triggerText: {
        flex: 1,
    },
    content: {},
    chevron: {
        width: 10,
        height: 10,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        transform: [{ rotate: '45deg' }],
        margin: 4,
    },
});

export { accordionVariants };