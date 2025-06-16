module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/*.(test|spec).+(ts|js)'
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.interface.ts',
    '!src/app/**/*.enum.ts',
    '!src/app/**/*.model.ts',
    '!src/app/main.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.config.ts',
    '!src/app.component.ts',
    '!src/app.config.ts',
    '!src/app.routes.ts',
    '!src/app/pages.routes.ts',
    '!src/app/test-connection.component.ts',
    '!src/test-helpers/**/*'
  ],
  coverageReporters: ['html', 'text-summary', 'lcov', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  transform: {
    // Configuración actualizada para ts-jest (sin usar globals)
    '^.+\\.(ts|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true // Mejor rendimiento
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  // Eliminado el bloque 'globals' (obsoleto para ts-jest)
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  // Opcional: Excluir archivos de cobertura que no son relevantes
  modulePathIgnorePatterns: [
    '<rootDir>/dist/', 
    '<rootDir>/e2e/'
  ]
};