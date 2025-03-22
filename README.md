# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Universal TokenConfig Component

A reusable React component for configuring animation tokens and other design system tokens in different UI components.

## Features

- Configure animation duration and easing tokens for any UI component
- Customizable component groups and naming
- Supports token descriptions and translations
- Real-time token value updates
- Works with any design system tokens structure

## Usage

The TokenConfig component can be used to configure animation tokens for any UI component, not just sliders. Here's how to use it:

```jsx
import { useState } from 'react';
import TokenConfig from './path/to/TokenConfig';

function YourComponent() {
  const [tokenValues, setTokenValues] = useState({
    BUTTON_HOVER_DURATION: '0.2s',
    BUTTON_HOVER_EASING: 'ease-out',
    BUTTON_PRESS_DURATION: '0.1s',
    BUTTON_PRESS_EASING: 'ease-in'
  });

  // Define descriptions for your tokens
  const tokenDescriptions = {
    BUTTON_HOVER_DURATION: 'Hover animation duration',
    BUTTON_HOVER_EASING: 'Hover animation easing',
    BUTTON_PRESS_DURATION: 'Press animation duration',
    BUTTON_PRESS_EASING: 'Press animation easing'
  };

  // Define component name translations if needed
  const componentNames = {
    'BUTTON': 'Button'
  };

  // Handle token changes
  const handleTokenChange = (newTokenValues) => {
    setTokenValues(newTokenValues);
    // Do something with the updated token values
  };

  return (
    <TokenConfig
      tokenValues={tokenValues}
      onTokenChange={handleTokenChange}
      tokenDescriptions={tokenDescriptions}
      componentNames={componentNames}
      title="Button Animation Configuration"
    />
  );
}
```

## Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `tokenValues` | Object | The current token values as key-value pairs | Yes |
| `onTokenChange` | Function | Callback function when token values change | Yes |
| `tokenDescriptions` | Object | Descriptions for each token | No |
| `componentNames` | Object | Translations for component names | No |
| `title` | String | Title for the configuration panel | No |

## Token Naming Convention

For optimal grouping and display, tokens should follow this naming pattern:

```
COMPONENTNAME_ACTIONNAME_PROPERTYTYPE
```

Examples:
- `BUTTON_HOVER_DURATION`
- `MODAL_APPEAR_EASING`
- `SLIDER_DRAG_MOTION`

## Supported Token Types

The component currently supports:
- Duration tokens (containing "DURATION" in the name)
- Easing/Motion tokens (containing "EASING" or "MOTION" in the name)

## Example

See `src/components/TokenConfigExample.jsx` for a complete example showing the TokenConfig used with different component types (Buttons, Modals, and Sliders).
