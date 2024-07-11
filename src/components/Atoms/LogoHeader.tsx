import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import Image from 'next/image';
import { Stack } from '@mui/system';

interface Props {
    title: string;
}
export default function LogoHeader({ title }: Props) {
    return (
        <>
            <Stack
                textAlign='center'
                display='flex'
                flexDirection='column'
                alignItems='center'
            >
                <Image
                    height={50}
                    width={50}
                    src={'/images/cydoc-logo.svg'}
                    alt='logo'
                />
                <Header as='h1' className='logo-text' content='Cydoc' />
            </Stack>
            <Container
                className='login-header'
                color='black'
                textAlign='center'
                content={title}
            />
        </>
    );
}
