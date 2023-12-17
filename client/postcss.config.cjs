/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const path = require("node:path");

module.exports = {
    plugins: {
        tailwindcss: {
            config: path.join(__dirname, "tailwind.config.cjs"),
        },
        autoprefixer: {},
    },
};
