// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#171717',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          50: '#eff6ff',
          800: '#1e40af',
        },
        secondary: '#f3f4f6',
        accent: {
          DEFAULT: '#60a5fa',
          900: '#1e3a8a',
          700: '#1d4ed8',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff', // để dùng text-destructive-foreground
        },
        input: '#d1d5db', // để dùng border-input
        ring: '#3b82f6', // để dùng focus:ring-ring
      },
    },
  },
  plugins: [],
};
