import { HPIStore } from '@contexts/HPIContext';
import EditNote from '@pages/EditNote/EditNote';

export function generateStaticParams() {
    return [{ slug: [''] }];
}

export default function EditNotePage() {
    return (
        <HPIStore>
            <EditNote />
        </HPIStore>
    );
}
