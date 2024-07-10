const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Custom function to get all SCSS files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else if (file.endsWith(".scss")) {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
};

const scssFiles = getAllFiles('./src');

module.exports = {
    entry: './dist/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    },
    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.beforeRun.tap('LoadSCSSFilesPlugin', () => {
                    scssFiles.forEach((file) => {
                        const outputFile = file.replace('src', 'dist').replace('.scss', '.css');
                        const outputDir = path.dirname(outputFile);
                        if (!fs.existsSync(outputDir)) {
                            fs.mkdirSync(outputDir, { recursive: true });
                        }
                        execSync(`sass ${file} ${outputFile}`);
                    });
                });
            }
        }
    ]
};
