module.exports = { 
  openHandlesTimeout:6000,
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  roots: ['<rootDir>/tests'], 
  transform: {
    '^.+\\.tsx?': 'ts-jest',
    
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(ali-oss)/)'
  ],
  moduleNameMapper: {
    '^ali-oss$': '<rootDir>/node_modules/ali-oss/dist/aliyun-oss-sdk.js'
  },
  
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
};