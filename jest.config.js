module.exports = {
  roots: ["src"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "mdx"],
  testPathIgnorePatterns: ["node_modules/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/*.test.(ts|tsx)"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  coverageDirectory: "coverage", // Ensures coverage is saved in the `coverage/` folder
  coverageReporters: ["json-summary", "text", "lcov"],
  coveragePathIgnorePatterns: [
    ".*\\.bin\\.tsx$",  // ignore generated *.bin.tsx files
    ".*\\/bin\\/.*"      // ignore any files in bin folders
  ]
};
