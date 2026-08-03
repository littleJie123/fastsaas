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
  globals: {
    'ts-jest': {
      // 测试目录单独 tsconfig（含 jest types）；主 tsconfig 只编 src
      tsConfig: '<rootDir>/tests/tsconfig.json',
      // typescript 6 与旧版 ts-jest 的 diagnostics 不兼容
      diagnostics: false
    }
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
