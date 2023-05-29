const path = require('path');

const projectDir = path.join(__dirname, '..');
const testDir = path.join(projectDir, 'src', 'server', 'tests');

module.exports = {
    rootDir: testDir,
    testRegex: '.spec.ts$',
    testEnvironment: 'node',
    transform: { '^.+\\.(j|t)s$': 'ts-jest' },
    moduleFileExtensions: ['js', 'json', 'ts'],
};
