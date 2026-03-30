import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
});

if (!globalThis.fetch) {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: jest.fn(),
  });
}
