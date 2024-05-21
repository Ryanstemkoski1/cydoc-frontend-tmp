import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// coverageProvider: 'v8',
// testEnvironment: 'jsdom',
// transform: {
//     '^.+\\.(ts|tsx)?$': 'ts-jest',
//     '^.+\\.(js|jsx)$': 'babel-jest',
// },
// snapshotSerializers: ['enzyme-to-json/serializer'],
// coveragePathIgnorePatterns: ['src/semantic', 'src/constants'],

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
    },
});
