import { Box } from '@mui/material';

import { useContentHeight } from '@hooks/useContentHeight';
import { SubscriptionBanner } from '@components/Molecules/SubscriptionBanner';
import { SubscriptionModal } from '@components/Molecules/SubscriptionModal';
import GlobalLoader from '@components/GlobalLoader/GlobalLoader';
import DrawerMenu from '@components/DrawerMenu/DrawerMenu';
import NavBlock from '@components/navigation/NavBlock/NavBlock';
import Footer from '@components/Footer/Footer';
import NavMenu from '@components/navigation/NavMenu';
import useAuth from '@hooks/useAuth';
import useProductDefinition from '@hooks/useProductDefinition';

interface Props {
    children: React.ReactNode;
}

export default function ContentProvider({ children }: Props) {
    const contentHeight = useContentHeight();
    const { isSignedIn } = useAuth();
    useProductDefinition();

    return (
        <Box className='layout'>
            <GlobalLoader />
            <SubscriptionBanner />
            <SubscriptionModal />

            {isSignedIn ? (
                <Box className='main'>
                    <DrawerMenu />
                    <Box
                        className='content'
                        sx={{
                            height: contentHeight,
                        }}
                    >
                        <NavBlock />
                        <Box className='children'>{children}</Box>
                        <Footer />
                    </Box>
                </Box>
            ) : (
                <>
                    <NavMenu attached={'top'} displayNoteName={true} />
                    {children}
                    <Footer />
                </>
            )}
        </Box>
    );
}
