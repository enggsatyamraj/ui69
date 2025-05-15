# rajsatyam

Unstyled, accessible UI components for React Native, inspired by shadcn/ui.

## What is rajsatyam?

rajsatyam is a collection of reusable, customizable UI components for React Native. Unlike traditional component libraries, rajsatyam doesn't publish the components as a package. Instead, it provides a CLI that adds the components directly to your project. This gives you complete control over the components, including the ability to customize them to fit your needs.

## Features

- 🚀 **Copy and paste** - Components are added directly to your project
- 💪 **Customizable** - Modify components to fit your specific needs
- 🔍 **Accessible** - Built with accessibility in mind
- 📝 **TypeScript** - Fully typed components
- 📱 **React Native friendly** - Works with both Expo and React Native CLI

## Installation

```bash
# Install using npx
npx rajsatyam add <component>

# Or install the CLI globally
npm install -g rajsatyam
rajsatyam add <component>
```

## Usage

```bash
# Add components to your project
npx rajsatyam add button

# List all available components
npx rajsatyam list
```

## Available Components

- Button - A pressable button component with multiple variants and sizes
- More components coming soon!

## Button Component Example

```jsx
import { View } from 'react-native';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {/* Default button */}
      <Button onPress={() => console.log('Pressed')}>
        Default Button
      </Button>
      
      {/* Destructive variant */}
      <Button 
        variant="destructive" 
        onPress={() => console.log('Delete pressed')}
      >
        Delete Item
      </Button>
      
      {/* Outline variant */}
      <Button 
        variant="outline" 
        onPress={() => console.log('Outline pressed')}
      >
        Outline
      </Button>
      
      {/* Different sizes */}
      <Button size="sm">Small Button</Button>
      <Button size="lg">Large Button</Button>
      
      {/* Loading and disabled states */}
      <Button loading>Loading...</Button>
      <Button disabled>Disabled</Button>
    </View>
  );
}
```

## Button Variants

- `default` - Default button style
- `destructive` - For destructive actions like delete
- `outline` - Button with an outline
- `secondary` - Alternative style
- `ghost` - Button without a background
- `link` - Button that looks like a link

## Button Sizes

- `default` - Default size
- `sm` - Small button
- `lg` - Large button
- `icon` - Icon button (square)

## License

MIT

## Acknowledgments

This project is inspired by [shadcn/ui](https://ui.shadcn.com/), which offers a similar approach for web applications.