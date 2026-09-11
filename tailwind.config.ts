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
        'secondary-hover': '#C49216',
        'secondary-light': '#FDF4DC',
        tertiary: '#18181B',
        neutral: '#71717A',
        'off-white': '#FAF7F2',
        'light-gray': '#F5EFE4',
        border: '#E8E2D5',
        'soft-gray': '#EFE8DB',
        'dark-obsidian': '#141518',
        'dark-card': '#1B1C20',
        'dark-soft': '#24252A',
        'cream': '#FAF7F2',
        'cream-warm': '#F5EFE4',
        'cream-light': '#FCFBF8',
        'cream-dark': '#EFE8DB',
        
        // Material theme tokens
        "surface-dim": "#dcd9d8",
        "on-secondary-fixed-variant": "#5c4200",
        "error-container": "#ffdad6",
        "background": "#FAF7F2",
        "on-secondary-container": "#705100",
        "tertiary-fixed": "#e5e2e1",
        "on-tertiary-container": "#777575",
        "on-surface": "#18181B",
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
        "on-background": "#18181B",
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
        'display': ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        'serif': ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        'sans': ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        'body': ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        'round': ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        "label-sm": ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
        "body-lg": ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
        "display-lg": ['"Playfair Display"', '"Cormorant Garamond"', "serif"],
        "label-md": ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
        "headline-lg-mobile": ['"Playfair Display"', '"Cormorant Garamond"', "serif"],
        "body-md": ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
        "headline-md": ['"Playfair Display"', '"Cormorant Garamond"', "serif"],
        "headline-lg": ['"Playfair Display"', '"Cormorant Garamond"', "serif"]
      },
      spacing: {
        'unit': '8px',
        'section-desktop': '140px',
        'section-mobile': '70px',
        'margin-desktop': '80px',
        'margin-tablet': '40px',
        'margin-mobile': '20px',
        "stack-lg": "48px",
        "container-max": "1360px",
        "gutter": "24px",
        "stack-md": "24px",
        "stack-sm": "12px",
      },
      maxWidth: {
        'container': '1400px',
        'container-max': '1360px',
      }
    },
  },
  plugins: [],
}
