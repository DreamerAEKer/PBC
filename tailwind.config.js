/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                thp: {
                    red: '#ED1C24', // Thailand Post Red
                    blue: '#1F2060', // Thailand Post Blue
                    gray: '#F5F5F5',
                }
            }
        },
    },
    plugins: [],
}
