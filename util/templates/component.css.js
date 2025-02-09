module.exports = (componentName) => {
  return ({
    content: `.oakd.${componentName.toLowerCase()} {
}
`,
    extension: `.css`
  });
}
