module.exports = {
    mode: 'jit',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {

        extend: {
            fontFamily: {
                inter: ['Inter'],
                'nato': ["Poppins", "sans-serif"]
            },
            colors: {
                primary: {
                    dark: "#422B8C",
                    light: "#EDE9FE"
                }
            }
        },
    },
    plugins: [
        // require('@tailwindcss/forms'),
            require('tailwindcss-dark-mode')()
    ],
}