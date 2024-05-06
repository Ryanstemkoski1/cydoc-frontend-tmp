import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import Image from 'next/image';

interface Props {
    title: string;
}
export default function LogoHeader({ title }: Props) {
    return (
        <>
            <Container textAlign='center'>
                <Image
                    height={50}
                    width={50}
                    src={'/images/cydoc-logo.svg'}
                    alt='logo'
                />
                <Header as='h1' className='logo-text' content='Cydoc' />
            </Container>
            <Container
                className='login-header'
                color='black'
                textAlign='center'
                content={title}
            />
        </>
    );
}
