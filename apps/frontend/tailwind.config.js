// apps/app1/tailwind.config.js
const { createGlobPatternsForDependencies } = require("@nrwl/react/tailwind");
const { join } = require("path");

module.exports = {
    content: [
        join(
            __dirname,
            "{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}"
        ),
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {}
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/colors/themes")[
                        "[data-theme=light]"
                    ],
                    primary: "#a991f7",
                    secondary: "#f6d860",
                    accent: "#2195ed",
                    neutral: "#202331",
                    "base-100": "#ffffff",
                    "accent-content": "#ffffff"
                },
                dark: {
                    ...require("daisyui/src/colors/themes")[
                        "[data-theme=dark]"
                    ],
                    primary: "#98f9eb",
                    secondary: "#3994bf",
                    accent: "#0d7377",
                    neutral: "#3d4451",
                    "base-100": "#161A1D"
                }
            }
        ]
    }
};
