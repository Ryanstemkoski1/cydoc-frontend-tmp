import { Suspense } from 'react';

interface Props {
    children: React.ReactNode;
}

export default function BrowseNotesLayout({ children }: Props) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
