import React from 'react';
import { Container, Image, Header } from 'semantic-ui-react';
import Logo from '../../assets/cydoc-logo.svg';

interface Props {
    title: string;
}
export default function LogoHeader({ title }: Props) {
    return (
        <>
            <Container textAlign='center'>
                <Image size='tiny' href='/' src={Logo} alt='logo' />
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
