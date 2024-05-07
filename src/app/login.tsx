import LoginPage from '@pages/Account/LoginPage';

export function generateStaticParams() {
    return [{ slug: [''] }];
}

export default LoginPage;
