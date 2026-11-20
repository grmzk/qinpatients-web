/**
 * ESLint Boundaries Configuration
 * https://github.com/javierbyte/eslint-plugin-boundaries
 *
 * Defines architecture layers for Feature-Sliced Design (FSD)
 */

module.exports = {
  elements: [
    {
      type: 'shared',
      pattern: 'shared/**/*',
      capture: ['elementType', 'elementName'],
    },
    {
      type: 'entities',
      pattern: 'entities/**/*',
      capture: ['elementType', 'elementName'],
    },
    {
      type: 'features',
      pattern: 'features/**/*',
      capture: ['elementType', 'elementName'],
    },
    {
      type: 'widgets',
      pattern: 'widgets/**/*',
      capture: ['elementType', 'elementName'],
    },
    {
      type: 'pages',
      pattern: 'pages/**/*',
      capture: ['elementType', 'elementName'],
    },
    {
      type: 'app',
      pattern: 'app/**/*',
      capture: ['elementType', 'elementName'],
    },
  ],
};
