import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 일부 Node 실행 환경이 불완전한 전역 localStorage를 노출하므로 테스트 저장소를 명시합니다.
const values = new Map()
const testStorage = {
  get length() { return values.size },
  clear: () => values.clear(),
  getItem: (key) => values.get(String(key)) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => values.delete(String(key)),
  setItem: (key, value) => values.set(String(key), String(value)),
}
Object.defineProperty(window, 'localStorage', { configurable: true, value: testStorage })
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: testStorage })

beforeEach(() => testStorage.clear())
afterEach(cleanup)
