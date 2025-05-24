# ui69

Unstyled, accessible UI components for React Native, inspired by shadcn/ui.

## What is ui69?

ui69 is a collection of reusable, customizable UI components for React Native. Unlike traditional component libraries, ui69 doesn't publish the components as a package. Instead, it provides a CLI that adds the components directly to your project. This gives you complete control over the components, including the ability to customize them to fit your needs.

## Features

- 🚀 **Copy and paste** - Components are added directly to your project
- 💪 **Customizable** - Modify components to fit your specific needs
- 🔍 **Accessible** - Built with accessibility in mind
- 📝 **TypeScript** - Fully typed components
- 📱 **React Native friendly** - Works with both Expo and React Native CLI

## Installation

```bash
# Install using npx
npx ui69 add <component>

# Or install the CLI globally
npm install -g ui69
ui69 add <component>
```

## Usage

```bash
# Add components to your project
npx ui69 add button

# Add multiple components interactively
npx ui69 add

# List all available components
npx ui69 list
```

## Available Components

- **Button** - A pressable button component with multiple variants and sizes
- **Skeleton** - Loading placeholder component with shimmer and wave animations
- **Avatar** - User profile image with fallback, status indicators, and grouping support
- **Badge** - Small status indicator with multiple variants and dot style option
- **Card** - Container component with header, content and footer sections
- **Seperator** - Simple divider component for separating content
- **Accordion** - Collapsible content sections with customizable styling and animations
- **Input** - Text input component with multiple variants, validation, and icon support
- **InputOTP** - One-time password input component with support for different input types
- **Toast** - Notification component with animations, gestures, and multiple variants
- More components coming soon!

## Toast Component Example

```jsx
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider, useToastController } from './components/ui/toast';
import { Button } from './components/ui/button';

// Wrap your app with required providers
export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider position="top-center" maxToasts={3}>
          <ToastExample />
        </ToastProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// Usage in your components
function ToastExample() {
  const { success, error, warning, info } = useToastController();

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Button onPress={() => success({ 
        title: "Success!", 
        description: "Your action was completed" 
      })}>
        Show Success Toast
      </Button>

      <Button onPress={() => error({ 
        title: "Error occurred", 
        description: "Something went wrong" 
      })}>
        Show Error Toast
      </Button>

      <Button onPress={() => warning({ 
        title: "Warning", 
        description: "Please check your input",
        action: { label: "Retry", onPress: () => console.log("Retry") }
      })}>
        Show Warning Toast
      </Button>

      <Button onPress={() => info({ 
        title: "Info", 
        description: "This is important information",
        persistent: true // Won't auto-dismiss
      })}>
        Show Info Toast
      </Button>
    </View>
  );
}
```

## Toast Features

- **5 variants**: default, success, error, warning, info
- **Gesture support**: Swipe to dismiss
- **Positioning**: 6 different positions (top/bottom + left/center/right)
- **Auto-dismiss**: Configurable duration or persistent toasts
- **Action buttons**: Interactive buttons within toasts
- **Custom icons**: Use your own icons or default variant icons
- **Stacking**: Multiple toasts with smooth animations
- **TypeScript**: Fully typed for better developer experience

## Toast Dependencies

The Toast component requires these additional packages:

```bash
npm install react-native-gesture-handler react-native-safe-area-context
```

For Expo projects:
```bash
npx expo install react-native-gesture-handler react-native-safe-area-context
```

## Skeleton Component Example

```jsx
import { View } from 'react-native';
import { Skeleton } from './components/ui/skeleton';

export default function App() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {/* Default shimmer animation */}
      <Skeleton width="100%" height={20} />
      
      {/* Wave animation */}
      <Skeleton 
        width="80%" 
        height={20} 
        animationType="wave" 
      />
      
      {/* Custom styling */}
      <Skeleton 
        width={60} 
        height={60} 
        borderRadius={30}
        backgroundColor="#c0c0c0"
        highlightColor="rgba(255, 255, 255, 0.6)"
      />
    </View>
  );
}
```

## Accordion Component Example

```jsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components' aesthetic.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## License

MIT

## Acknowledgments

This project is inspired by [shadcn/ui](https://ui.shadcn.com/), which offers a similar approach for web applications.