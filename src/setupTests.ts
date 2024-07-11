import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({ adapter: new Adapter() });

vi.mock('./hooks/useAuth');
vi.mock('./providers/AuthProvider');
vi.mock('./providers/UserInfoProvider');

vi.mock('next/navigation', async (importOriginal) => {
    const mod = await importOriginal<typeof import('next/navigation')>();
    return {
        ...mod,
        // replace some exports
        useRouter: () => ({
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        }),
    };
});
