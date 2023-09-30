/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/scripts/**/*.ts', './src/index.html'],
  theme: {
    extend: {
      fontFamily: {
        Ubuntu: ['Ubuntu', 'system-ui', 'sans-serif'],
        Roboto: ['Roboto', 'system-ui', 'sans-serif'],
        'Work-Sans': ['Work-Sans', 'system-ui', 'sans-serif']
      }
    },

    screens: {
      lg: { max: '1440px' },
      // => @media (max-width: 1440px) { ... }

      md: { max: '992px' },
      // => @media (max-width: 992px) { ... }

      sm: { max: '768px' },
      // => @media (max-width: 768px) { ... }

      xs: { max: '576px' }
      // => @media (max-width:
    },

    animation: {
      spin: 'spin-keyframes 1s linear infinite',
      wave: 'wave-keyframes 3s linear alternate infinite',
      coin: 'coin-keyframes 5s linear alternate infinite'
    },
    keyframes: {
      'spin-keyframes': {
        '0%': { transform: 'rotateZ(0deg)' },
        '100%': { transform: 'rotateZ(360deg)' }
      },
      'wave-keyframes': {
        '0%': { transform: 'translateX(-45%)' },
        '100%': { transform: 'translateX(-55%)' }
      },
      'coin-keyframes': {
        '0%': { transform: 'translateX(-91%) translateY(-5%) rotateZ(7deg)' },
        '10%': { transform: 'translateX(-79%) translateY(-1%) rotateZ(4deg)' },
        '20%': { transform: 'translateX(-61%) translateY(-10%) rotateZ(1deg)' },
        '30%': { transform: 'translateX(-47%) translateY(-15%) rotateZ(-9deg)' },
        '50%': { transform: 'translateX(-23%) translateY(3%) rotateZ(-3deg) ' },
        '70%': { transform: 'translateX(5%) translateY(9%) rotateZ(5deg) ' },
        '80%': { transform: 'translateX(27%) translateY(4%) rotateZ(3deg) ' },
        '100%': { transform: 'translateX(43%) translateY(-8%) rotateZ(-11deg) ' }
      }
    }
  },
  plugins: []
};
