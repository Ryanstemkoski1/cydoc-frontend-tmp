import { HPITemplateStore } from '@contexts/HPITemplateContext';

export default function TemplateLayout({ children }) {
    return <HPITemplateStore>{children}</HPITemplateStore>;
}
