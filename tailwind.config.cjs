module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(246,214,89)",
        background: "#22252F",
        secondary: "#29313C",
        text: "#3D3622",
        light: "#808590",
      },
    },
  },
};
