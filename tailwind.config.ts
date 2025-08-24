import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				linkedin: {
					DEFAULT: 'hsl(var(--linkedin-blue))',
					light: 'hsl(var(--linkedin-blue-light))',
					lighter: 'hsl(var(--linkedin-blue-lighter))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
        backgroundImage: {
          'gradient-primary': 'var(--gradient-primary)',
          'gradient-card': 'var(--gradient-card)',
          'gradient-hero': 'var(--gradient-hero)',
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        boxShadow: {
          'card': 'var(--shadow-card)',
          'elevated': 'var(--shadow-elevated)',
          'glow': 'var(--shadow-glow)',
          'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        },
        transitionTimingFunction: {
          'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
        keyframes: {
          'accordion-down': {
            from: {
              height: '0'
            },
            to: {
              height: 'var(--radix-accordion-content-height)'
            }
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)'
            },
            to: {
              height: '0'
            }
          },
          'fade-in-up': {
            from: {
              opacity: '0',
              transform: 'translateY(30px)'
            },
            to: {
              opacity: '1',
              transform: 'translateY(0)'
            }
          },
          'slide-in-left': {
            from: {
              opacity: '0',
              transform: 'translateX(-50px)'
            },
            to: {
              opacity: '1',
              transform: 'translateX(0)'
            }
          },
          'slide-in-right': {
            from: {
              opacity: '0',
              transform: 'translateX(50px)'
            },
            to: {
              opacity: '1',
              transform: 'translateX(0)'
            }
          },
          'scale-in': {
            from: {
              opacity: '0',
              transform: 'scale(0.8)'
            },
            to: {
              opacity: '1',
              transform: 'scale(1)'
            }
          },
          'floating': {
            '0%, 100%': {
              transform: 'translateY(0px)'
            },
            '50%': {
              transform: 'translateY(-20px)'
            }
          },
          'pulse-glow': {
            from: {
              boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
            },
            to: {
              boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)'
            }
          },
          'gradient-shift': {
            '0%, 100%': {
              backgroundPosition: '0% 50%'
            },
            '50%': {
              backgroundPosition: '100% 50%'
            }
          },
          'shimmer': {
            '0%': {
              backgroundPosition: '-200% 0'
            },
            '100%': {
              backgroundPosition: '200% 0'
            }
          }
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
          'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
          'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
          'scale-in': 'scale-in 0.5s ease-out forwards',
          'floating': 'floating 6s ease-in-out infinite',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
          'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
          'shimmer': 'shimmer 2s linear infinite',
        }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;