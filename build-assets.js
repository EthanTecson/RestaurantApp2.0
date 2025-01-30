// Import required modules
const chokidar = require("chokidar");
const { join, dirname, relative } = require("path");
const {
    mkdirSync,    // Function to create directories synchronously
    existsSync,   // Function to check if a file or directory exists
    writeFileSync // Function to write files synchronously
} = require("fs");
const sass = require("sass"); // Library to compile SCSS to CSS
const postcss = require("postcss"); // PostCSS library for processing compiled CSS
const postCSSConfig = require("./postcss.config.js"); // Import PostCSS configuration
const { exec } = require("child_process"); // Node.js function to execute shell commands
const { minify } = require("terser"); // Library to minify JavaScript


// Function to compile SCSS to CSS
async function compileSass(file) {
    const relativeFilePath = relative("./scss", file); // Get file path relative to the SCSS directory
    const cssFilePath = join("./css", relativeFilePath); // Construct the CSS file path
    const outFile = cssFilePath.replace(".scss", ".css"); // Replace SCSS extension with CSS
    const outDir = dirname(outFile); // Get the output directory path for the CSS file

    // Create output directory if it doesn't exist
    if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
    }

    // Compile SCSS to CSS
    const result = sass.compile(file, { outFile });

    // Process the compiled CSS with PostCSS
    const postCSSResult = await postcss(postCSSConfig.plugins).process(
        result.css,
        {
            from: undefined,
            to: outFile,
        }
    );

    // Write the processed CSS to a file
    writeFileSync(outFile, postCSSResult.css);
}

// Initialize file watcher for SCSS files
const watcher = chokidar.watch(["./scss"/* , "./js" */], {
    // You can add Chokidar options here if needed
});

// Add event listeners for SCSS file changes
watcher.on("all", (event, path) => {
    if (path.endsWith(".scss")) {
        // Compile SCSS file when changed
        compileSass(path).catch((error) =>
            console.error(`Error compiling SCSS: ${error}`)
        );
        console.log(`SCSS file ${path} has been ${event}`);
        // Potentially reload the browser if integrated with BrowserSync or similar
        // browserSync.reload();
    }
});

// Function to transpile JavaScript files (currently commented out)
// async function compileJS(file) {
//     const relativeFilePath = relative("./js", file); // Get file path relative to the JS directory
//     const compiledFilePath = join("./compiled_js", relativeFilePath).replace(
//         ".js",
//         ".min.js"
//     ); // Construct the path for the compiled and minified JS file
//     const outDir = dirname(compiledFilePath); // Get the output directory path for the JS file

//     // Create output directory if it doesn't exist
//     if (!existsSync(outDir)) {
//         mkdirSync(outDir, { recursive: true });
//     }

//     // Transpile and minify JavaScript using Babel and Terser
//     exec(
//         `npx babel ${file} --config-file ./babel.config.js`,
//         async (err, stdout, stderr) => {
//             if (err) {
//                 console.error(`Error transpiling ${file}: ${err}`);
//                 return;
//             }

//             try {
//                 const minified = await minify(stdout);
//                 writeFileSync(compiledFilePath, minified.code);
//                 console.log(
//                     `Minified and compiled ${file} to ${compiledFilePath}`
//                 );
//             } catch (minifyErr) {
//                 console.error(`Error minifying ${file}: ${minifyErr}`);
//             }
//         }
//     );
// }

// Add event listeners for JavaScript file changes (currently commented out)
// watcher.on("all", (event, path) => {
//     if (path.endsWith(".js")) {
//         // Compile JavaScript file when changed
//         compileJS(path).catch((error) =>
//             console.error(`Error compiling JS: ${error}`)
//         );
//         console.log(`JS file ${path} has been ${event}`);
//         // Potentially reload the browser if integrated with BrowserSync or similar
//         // browserSync.reload();
//     }
// });