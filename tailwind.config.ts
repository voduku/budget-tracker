import type {Config} from 'tailwindcss';
import plugin from 'flowbite/plugin';

export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
        "./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}"
    ],
    plugins: [plugin],
    darkMode: 'selector',
    theme: {
        extend: {
            zIndex: {
                '100': '100'
            },
            colors: {
                // flowbite-svelte
                primary: {
                    50: '#E92A67',
                    100: '#D43577',
                    200: '#BF3F87',
                    300: '#A94A97',
                    400: '#9455A7',
                    500: '#7F5FB6',
                    600: '#6A6AC6',
                    700: '#5475D6',
                    800: '#3F7FE6',
                    900: '#2A8AF6'
                }
            }
        }
    }
} as Config;