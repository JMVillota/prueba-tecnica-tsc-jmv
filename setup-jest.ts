import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock global objects
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    appearance: ['-webkit-appearance']
  })
});

// Mock para DatePipe y otros pipes
Object.defineProperty(Intl, 'DateTimeFormat', {
  value: function() {
    return {
      format: (date: Date) => date.toLocaleDateString('es-ES')
    };
  }
});

// Mock de jasmine para Jest - CORREGIDO
(global as any).jasmine = {
  createSpyObj: (baseName: string, methodNames: string[]) => {
    const obj: any = {};
    methodNames.forEach(methodName => {
      obj[methodName] = jest.fn();
    });
    return obj;
  },
  createSpy: (name: string) => jest.fn()
};

// Mock de spyOn para Jest
(global as any).spyOn = jest.spyOn;

// Extender expect con métodos de jasmine
import { expect as jestExpect } from '@jest/globals';

jestExpect.extend({
  toBeTrue(received: any) {
    const pass = received === true;
    return {
      message: () => `expected ${received} to be true`,
      pass
    };
  },
  toBeFalse(received: any) {
    const pass = received === false;
    return {
      message: () => `expected ${received} to be false`,
      pass
    };
  },
  toBeNull(received: any) {
    const pass = received === null;
    return {
      message: () => `expected ${received} to be null`,
      pass
    };
  }
});

// Mock para RouterTestingModule
(global as any).RouterTestingModule = {
  withRoutes: () => ({})
};

// Mock para console warnings en tests
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Angular is running in development mode') ||
       args[0].includes('NG0100'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('NG0100') ||
       args[0].includes('Error en ProductService'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
});

afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Declarar tipos para TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTrue(): R;
      toBeFalse(): R;
      toBeNull(): R;
    }
  }
}