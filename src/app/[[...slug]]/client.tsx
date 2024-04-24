'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// const App = dynamic(() => import('../../App'), { ssr: false });
import { App } from 'App';

export function ClientOnly() {
    return <App />;
}
