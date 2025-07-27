import { type Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: ["./src/*"],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
};

export default config;
