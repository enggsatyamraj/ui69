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

# List all available components
npx ui69 list
```

## Available Components

- Button - A pressable button component with multiple variants and sizes
- Skeleton - Loading placeholder component with shimmer and wave animations
- Avatar - User profile image with fallback, status indicators, and grouping support
- Badge - Small status indicator with multiple variants and dot style option
- Card - Container component with header, content and footer sections
- Seperator - Simple divider component for separating content
- Accordion - Collapsible content sections with customizable styling and animations
- More components coming soon!

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
      
      {/* Custom animation speed */}
      <Skeleton 
        width="90%" 
        height={16} 
        duration={2000} // Slower animation
      />
      
      {/* No animation */}
      <Skeleton 
        width="100%" 
        height={20} 
        animationType="none" 
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
    
      
        Is it accessible?
        
          Yes. It adheres to the WAI-ARIA design pattern.
        
      
      
        Is it styled?
        
          
            Yes. It comes with default styles that matches the other
            components' aesthetic.
          
        
      
      
        Is it animated?
        
          
            Yes. It's animated by default, but you can disable it if you prefer.
          
        
      
    
  )
}
```

## License

MIT

## Acknowledgments

This project is inspired by [shadcn/ui](https://ui.shadcn.com/), which offers a similar approach for web applications.