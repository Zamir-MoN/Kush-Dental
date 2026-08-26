import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'sm': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }], // 28px
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '4xl': ['2.75rem', { lineHeight: '3rem' }], // 44px
        '5xl': ['3.5rem', { lineHeight: '1.1' }], // 56px
        '6xl': ['4.5rem', { lineHeight: '1.1' }], // 72px
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#DCA51B',
        tertiary: '#111111',
        neutral: '#787776',
        'off-white': '#F9F5EF',
        'light-gray': '#F6F3F1',
        border: '#D9D7D4',
        'soft-gray': '#EAE8E6',
        'dark-soft': '#2A2A2A',
        
        // Colors from Booking page Material theme
        "surface-dim": "#dcd9d8",
        "on-secondary-fixed-variant": "#5c4200",
        "error-container": "#ffdad6",
        "background": "#F9F5EF",
        "on-secondary-container": "#705100",
        "tertiary-fixed": "#e5e2e1",
        "on-tertiary-container": "#777575",
        "on-surface": "#1b1c1b",
        "secondary-fixed": "#ffdea2",
        "surface-tint": "#5d5f5f",
        "outline-variant": "#c4c7c8",
        "tertiary-container": "#ffffff",
        "on-primary-container": "#747676",
        "tertiary-fixed-dim": "#c8c6c5",
        "surface-container": "#f0edec",
        "on-primary": "#ffffff",
        "inverse-on-surface": "#f3f0ef",
        "secondary-container": "#fec33c",
        "on-background": "#1b1c1b",
        "on-secondary": "#ffffff",
        "surface-variant": "#e4e2e0",
        "surface-container-high": "#eae8e6",
        "primary-fixed-dim": "#c6c6c7",
        "primary-container": "#ffffff",
        "on-tertiary-fixed-variant": "#474646",
        "on-surface-variant": "#444748",
        "primary-fixed": "#e2e2e2",
        "secondary-fixed-dim": "#f8bd36",
        "surface": "#fcf9f7",
        "on-tertiary-fixed": "#1c1b1b",
        "inverse-primary": "#c6c6c7",
        "surface-bright": "#fcf9f7",
        "on-secondary-fixed": "#261900",
        "surface-container-low": "#f6f3f1",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "inverse-surface": "#303030",
        "surface-container-highest": "#e4e2e0",
        "surface-container-lowest": "#ffffff",
        "on-error": "#ffffff",
        "outline": "#747878",
        "error": "#ba1a1a",
        "on-primary-fixed": "#1a1c1c",
        "on-primary-fixed-variant": "#454747"
      },
      fontFamily: {
        'display': ['"Nunito"', 'sans-serif'],
        'body': ['"Hanken Grotesk"', 'sans-serif'],
        "label-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "display-lg": ['"Nunito"', "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ['"Nunito"', "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ['"Nunito"', "sans-serif"],
        "headline-lg": ['"Nunito"', "sans-serif"]
      },
      spacing: {
        'unit': '8px',
        'section-desktop': '160px',
        'section-mobile': '80px',
        'margin-desktop': '80px',
        'margin-tablet': '40px',
        'margin-mobile': '20px',
        "stack-lg": "48px",
        "container-max": "1280px",
        "gutter": "24px",
        "stack-md": "24px",
        "stack-sm": "12px",
      },
      maxWidth: {
        'container': '1440px',
        'container-max': '1280px',
      }
    },
  },
  plugins: [],
}
