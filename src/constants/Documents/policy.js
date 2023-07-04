import React from 'react';
import NavMenu from '../../components/navigation/NavMenu';

{
    /* eslint-disable */
}
const stylingObject = {
    body: {
        background: 'transparent',
        marginLeft: '3em',
        marginRight: '3em',
        marginBottom: '3em',
    },
    title: {
        marginTop: '2em',
        marginBottom: '1em',
        fontFamily: 'Arial',
        fontSize: '26px',
        color: '#000000',
    },
    subtitle: {
        fontFamily: 'Arial',
        color: '#595959',
        fontSize: '15px',
    },
    heading_1: {
        fontFamily: 'Arial',
        fontSize: '19px',
        color: '#000000',
    },
    heading_2: {
        fontFamily: 'Arial',
        fontSize: '17px',
        color: '#000000',
    },
    body_text: {
        color: '#595959',
        fontSize: '15px',
        fontFamily: 'Arial',
    },
    link: {
        color: '#3030F1',
        fontSize: '15px',
        fontFamily: 'Arial',
        wordBreak: 'break-word',
    },
};
const Title = () => {
    return <div style={stylingObject.title}>Privacy Policy</div>;
};
const Policy = (props) => {
    return (
        <div>
            {props.title ? null : <NavMenu />}
            <div style={stylingObject.body}>
                <div style={stylingObject.subtitle}>
                    {props.title ? null : <Title />}
                    <div
                        className={stylingObject.body_text}
                        style={{
                            lineHeight: '1.5',
                            color: 'rgb(89,89,89)',
                            fontSize: '15px',
                        }}
                    >
                        <span>
                            This privacy notice for Cydoc, LLC ("
                            <strong>Company</strong>," "<strong>we</strong>," "
                            <strong>us</strong>," or "<strong>our</strong>"),
                            describes how and why we might collect, store, use,
                            and/or share ("<strong>process</strong>") your
                            information when you use our services ("
                            <strong>Services</strong>"), such as when you:
                        </span>
                        <ul>
                            <li>
                                Visit our website at{' '}
                                <a
                                    href='http://www.cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    http://www.cydoc.ai
                                </a>
                                , or any website of ours that links to this
                                privacy notice
                            </li>
                            <li>
                                Download and use our mobile application (Cydoc),
                                or any other application of ours that links to
                                this privacy notice
                            </li>
                            <li>
                                Engage with us in other related ways, including
                                any sales, marketing, or events
                            </li>
                        </ul>
                        <div style={stylingObject.body_text}>
                            <span style={{ color: 'rgb(127,127,127)' }}>
                                <strong>Questions or concerns?</strong> Reading
                                this privacy notice will help you understand
                                your privacy rights and choices. If you do not
                                agree with our policies and practices, please do
                                not use our Services. If you still have any
                                questions or concerns, please contact us at{' '}
                                <a
                                    href='mailto:admin@cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    admin@cydoc.ai
                                </a>
                                .
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div style={{ lineHeight: '1.5', fontSize: '15px' }}>
                        <span>
                            <strong>SUMMARY OF KEY POINTS</strong>
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                <em>
                                    This summary provides key points from our
                                    privacy notice, but you can find out more
                                    details about any of these topics by
                                    clicking the link following each key point
                                    or by using our table of contents below to
                                    find the section you are looking for. You
                                    can also click{' '}
                                    <a href='#toc' style={stylingObject.link}>
                                        here
                                    </a>{' '}
                                    to go directly to our table of contents.
                                </em>
                            </strong>
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                What personal information do we process?
                            </strong>{' '}
                            When you visit, use, or navigate our Services, we
                            may process personal information depending on how
                            you interact with Cydoc, LLC and the Services, the
                            choices you make, and the products and features you
                            use. Click{' '}
                            <a href='#personalinfo' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                Do we process any sensitive personal
                                information?
                            </strong>{' '}
                            We may process sensitive personal information when
                            necessary with your consent or as otherwise
                            permitted by applicable law. Click{' '}
                            <a href='#sensitiveinfo' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                Do we receive any information from third
                                parties?
                            </strong>{' '}
                            We do not receive any information from third
                            parties.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>How do we process your information?</strong>{' '}
                            We process your information to provide, improve, and
                            administer our Services, communicate with you, for
                            security and fraud prevention, and to comply with
                            law. We may also process your information for other
                            purposes with your consent. We process your
                            information only when we have a valid legal reason
                            to do so. Click{' '}
                            <a href='#infouse' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                In what situations and with which parties do we
                                share personal information?
                            </strong>{' '}
                            We may share information in specific situations and
                            with specific third parties. Click{' '}
                            <a href='#whoshare' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>
                                How do we keep your information safe?
                            </strong>{' '}
                            We have organizational and technical processes and
                            procedures in place to protext your personal
                            information. However, no electronic transmission
                            over the internet or information storage technology
                            can be guaranteed to be 100% secure, so we cannot
                            promise or guarantee that hackers, cybercriminals,
                            or other unauthorized third parties will not be able
                            to defeat our security and improperly collect,
                            access, steal, or modify your information. Click{' '}
                            <a href='#infosafe' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>What are your rights?</strong> Depending on
                            where you are located geographically, the applicable
                            privacy law may mean you have certain rights
                            regarding your personal information. Click{' '}
                            <a href='#privacyrights'>here</a> to learn more.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            <strong>How do you exercise your rights?</strong>{' '}
                            The easiest way to exercise your rights is by
                            filling out our data subject request form available
                            here:__________, or by contacting us. We will
                            consider and act upon any request in accordance with
                            applicable data protection laws.
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.body_text}>
                            Want to learn more about what Cydoc, LLC does with
                            any information we collect? Click{' '}
                            <a href='#toc' style={stylingObject.link}>
                                here
                            </a>{' '}
                            to review the notice in full.
                        </span>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='toc'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>TABLE OF CONTENTS</strong>
                        </span>
                        <div>
                            <br />
                        </div>
                        <span style={stylingObject.link}>
                            <a href='#infocollect'>
                                1. WHAT INFORMATION DO WE COLLECT?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#infouse'>
                                2. HOW DO WE PROCESS YOUR INFORMATION?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#whoshare'>
                                3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL
                                INFORMATION?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#inforetain'>
                                4. HOW LONG DO WE KEEP YOUR INFORMATION?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#infosafe'>
                                5. HOW DO WE KEEP YOUR INFORMATION SAFE?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#infominors'>
                                6. DO WE COLLECT INFORMATION FROM MINORS?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#privacyrights'>
                                7. WHAT ARE YOUR PRIVACY RIGHTS?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#DNT'>
                                8. CONTROLS FOR DO-NOT-TRACK FEATURES
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#caresidents'>
                                9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY
                                RIGHTS?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#policyupdates'>
                                10. DO WE MAKE UPDATES TO THIS NOTICE?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#contact'>
                                11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                            </a>
                        </span>
                        <br />
                        <span style={stylingObject.link}>
                            <a href='#request'>
                                12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE
                                DATA WE COLLECT FROM YOU?
                            </a>
                        </span>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='infocollect'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span id='control' style={stylingObject.heading_1}>
                            <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div id='personalinfo'>
                            <span style={stylingObject.heading_2}>
                                <strong>
                                    Personal information you disclose to us
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span style={stylingObject.body_text}>
                                <em>
                                    <strong>In Short:</strong> We collect
                                    personal information that you provide to us.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span style={stylingObject.body_text}>
                                We collect personal information that you
                                voluntarily provide to us when you register on
                                the Services, express an interest in obtaining
                                information about us or our products and
                                Services, when you participate in activities on
                                the Services, or otherwise when you contact us.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <div
                                id='providedbyyou'
                                style={stylingObject.body_text}
                            >
                                <span>
                                    <strong>
                                        Personal Information Provided by You.
                                    </strong>{' '}
                                    The personal information that we collect
                                    depends on the context of your interactions
                                    with us and the Services, the choices you
                                    make, and the products and features you use.
                                    The personal information we collect may
                                    include the following:{' '}
                                </span>
                                <ul>
                                    <li>names</li>
                                    <li>phone numbers</li>
                                    <li>email addresses</li>
                                    <li>mailing addresses</li>
                                    <li>job titles</li>
                                    <li>usernames</li>
                                    <li>passwords</li>
                                    <li>contact preferences</li>
                                    <li>contact or authentication data</li>
                                    <li>billing addresses</li>
                                    <li>debit/credit card numbers</li>
                                </ul>
                            </div>
                            <div
                                id='sensitiveinfo'
                                style={stylingObject.body_text}
                            >
                                <span>
                                    <strong>Sensitive Information.</strong> When
                                    necessary, with your consent or as otherwise
                                    permitted by applicable law, we process the
                                    following categories of sensitive
                                    information:
                                </span>
                                <ul>
                                    <li>student data</li>
                                </ul>
                            </div>
                            <div
                                id='paymentdata'
                                style={stylingObject.body_text}
                            >
                                <span>
                                    <strong>Payment Data.</strong> We may
                                    collect data necessary to process your
                                    payment if you make purchases, such as your
                                    payment instrument number (such as a credit
                                    card number), and the security code
                                    associated with your payment instrument. All
                                    payment data is stored by Stripe. You may
                                    find their privacy notice link(s) here:{' '}
                                </span>
                                <span>
                                    <br />
                                    <a
                                        href='https://stripe.com/privacy'
                                        style={stylingObject.link}
                                    >
                                        https://stripe.com/privacy
                                    </a>
                                    .
                                </span>
                            </div>
                            <br />
                            <div
                                id='applicationdata'
                                style={stylingObject.body_text}
                            >
                                <span>
                                    <strong>Application Data.</strong> If you
                                    use our application(s), we also may collect
                                    the following information if you choose to
                                    provide us with access or permission:
                                </span>
                                <ul>
                                    <li>
                                        <em>Push Notifications.</em> We may
                                        request to send you push notifications
                                        regarding your account or certain
                                        features of the application(s). If you
                                        wish to opt out from receiving these
                                        types of communcations, you may turn
                                        them off in your device's settings.
                                    </li>
                                </ul>
                                <span>
                                    This information is primarily needed to
                                    maintain the security and operation of our
                                    application(s), for troubleshooting, and for
                                    our internal analytics and reporting
                                    purposes.
                                </span>
                                <span>
                                    <br />
                                    <br />
                                </span>
                                <span>
                                    All personal information that you provide to
                                    us must be true, complete, and accurate, and
                                    you must notify us of any changes to such
                                    personal information.
                                </span>
                            </div>
                        </div>
                        <br />
                        <div
                            id='infoautocollect'
                            style={{ lineHeight: '1.5', fontSize: '15px' }}
                        >
                            <span style={stylingObject.heading_2}>
                                <strong>
                                    Information automatically collected
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <div style={stylingObject.body_text}>
                                <span>
                                    <em>
                                        <strong>In Short:</strong> Some
                                        information — such as your Internet
                                        Protocol (IP) address and/or browser and
                                        device characteristics — is collected
                                        automatically when you visit our
                                        Services.
                                    </em>
                                </span>
                                <span>
                                    <br />
                                    <br />
                                </span>
                                <span>
                                    We automatically collect certain information
                                    when you visit, use, or navigate the
                                    Services. This information does not reveal
                                    your specific identity (like your name or
                                    contact information) but may include device
                                    and usage information, such as your IP
                                    address, browser and device characteristics,
                                    opersating system, language preferences,
                                    referring URLs, device name, country,
                                    location, information about how and when you
                                    use our Services, and other technical
                                    information. This information is primarily
                                    needed to maintain the security and
                                    operation of our Services, and for our
                                    internal analytics and reporting purposes.
                                </span>
                                <span>
                                    <br />
                                    <br />
                                </span>
                                <span>
                                    The information we collect includes:
                                </span>
                                <ul>
                                    <li>
                                        <em>Log and Usage Data.</em> Log and
                                        usage data is service-related,
                                        diagnostic, usage, and performance
                                        information our servers automatically
                                        collect when you access or use our
                                        Services and which we record in log
                                        files. Depending on how you interact
                                        with us, this log data may include your
                                        IP address, device information, browser
                                        type, and settings and information about
                                        your activity in the Serivces (such as
                                        the data/time stamps associated with
                                        your usage, pages and files viewed,
                                        searchs, and other actions you take such
                                        as which features you use), device event
                                        information (such as system activity,
                                        error reports (sometimes called "crash
                                        dumps"), and hardware settings).
                                    </li>
                                    <li>
                                        <em>Device Data.</em> We collect device
                                        data such as information about your
                                        computer, phone, tablet, or other device
                                        you use to access the Services.
                                        Depending on the device used, this
                                        device data may include information such
                                        as you IP address (or proxy server),
                                        device and application identification
                                        numbers, location, browser type,
                                        hardware model, Internet service
                                        provider and/or mobile carrier,
                                        operating system, and system
                                        configuration information.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        id='infouse'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span id='control' style={stylingObject.heading_1}>
                            <strong>
                                2. HOW DO WE PROCESS YOUR INFORMATION?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> We process your
                                    information to provide, improve, and
                                    administer our Services, communicate with
                                    you, for security and fraud prevention, and
                                    to comply with law. We may also process your
                                    information for other purposes with your
                                    consent.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    We process your personal information for a
                                    variety of reasons, depending on how you
                                    interact with our Services, including:
                                </strong>
                            </span>
                            <ul>
                                <li>
                                    <strong>
                                        To facilitate account creation and
                                        authentication and otherwise manage user
                                        accounts.
                                    </strong>{' '}
                                    We may process your information so you can
                                    create and log in to your account, as well
                                    as keep your account in working order.
                                </li>
                                <li>
                                    <strong>
                                        To deliver and facilitate delivery of
                                        services to the user.
                                    </strong>{' '}
                                    We may process your information to provide
                                    you with the requested service.
                                </li>
                                <li>
                                    <strong>
                                        To respond to user inquiries/offer
                                        support to users.
                                    </strong>{' '}
                                    We may process your information to respond
                                    to your inquiries and solve any potential
                                    issues you might have with the requested
                                    service.
                                </li>
                                <li>
                                    <strong>
                                        To send administrative information to
                                        you.
                                    </strong>{' '}
                                    We may process your information to send you
                                    details about out products and services,
                                    changes to our terms and policies, and other
                                    similar information.
                                </li>
                                <li>
                                    <strong>
                                        To fulfill and manage your orders.
                                    </strong>{' '}
                                    We may process your information to fulfill
                                    and manage your orders, payments, returns,
                                    and exchanges made through the Services.
                                </li>
                                <li>
                                    <strong>
                                        To enable user-to-user communications.
                                    </strong>{' '}
                                    We may process your information if you
                                    choose to use any of our offerings that
                                    allow for communication with another user.
                                </li>
                                <li>
                                    <strong>To request feedback.</strong> We may
                                    process your information when necessary to
                                    request feedbacl and to contact you about
                                    your use of our Services.
                                </li>
                                <li>
                                    <strong>
                                        To send you marketing and promotional
                                        communications.
                                    </strong>{' '}
                                    We may process the personal information you
                                    send to us for our marketing purposes, if
                                    this is in accordance with your marketing
                                    perferences. You can opt out of our
                                    marketing emails at any time. For more
                                    information, see "
                                    <a
                                        href='#privacyrights'
                                        style={stylingObject.link}
                                    >
                                        WHAT ARE YOUR PRIVACY RIGHTS?
                                    </a>
                                    " below.
                                </li>
                                <li>
                                    <strong>To post testimonials.</strong> We
                                    post testimonials on our Services that may
                                    contain personal information.
                                </li>
                                <li>
                                    <strong>To protect our Services.</strong> We
                                    may process your information as part of our
                                    efforts to keep our Services safe and
                                    secure, including fraud monitoring and
                                    prevention.
                                </li>
                                <li>
                                    <strong>
                                        To evaluate and improve our Services,
                                        products, marketing, and your
                                        experience.
                                    </strong>{' '}
                                    We may process your information when we
                                    believe it is necessary to identify usage
                                    trends, determine the effectiveness of our
                                    promotional campaigns, and to evaluate and
                                    improve our Services, products, marketing,
                                    and your experience.
                                </li>
                                <li>
                                    <strong>To identify usage trends.</strong>{' '}
                                    We may process information about how you use
                                    our Services to better understand how they
                                    are being used so we can improve them.
                                </li>
                                <li>
                                    <strong>
                                        To determine the effectiveness of our
                                        marketing and promotional campaigns.
                                    </strong>{' '}
                                    We may process your information to better
                                    understand how to provide marketing and
                                    promotional campaigns that are most relevant
                                    to you.
                                </li>
                                <li>
                                    <strong>
                                        To comply with our legal obligations.
                                    </strong>{' '}
                                    We may process your information to comply
                                    with our legal obligations, respond to legal
                                    requests, and exercise, establish, or defend
                                    our legal rights.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        id='whoshare'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL
                                INFORMATION?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> We may share
                                    information in specific situations described
                                    in this section and/or with the following
                                    third parties.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We may need to share your personal information
                                in the following siutations:{' '}
                            </span>
                            <ul>
                                <li>
                                    <strong>Business Transfers.</strong> We may
                                    share or transfer your information in
                                    connection with, or during negotiations of,
                                    any merger, sale of company assets,
                                    financing, or acquisition of all or a
                                    portion of our business to another company.
                                </li>
                                <li>
                                    <strong>Affiliates.</strong> We may share
                                    your information with our affiliates, in
                                    which case we will require those affiliates
                                    to honor this privacy notice. Affiliates
                                    include our parent company and any
                                    subsidiaries, joint venture partners, or
                                    other companies that we control or that are
                                    under common control with us.
                                </li>
                                <li>
                                    <strong>Business Partners.</strong> We may
                                    share your information with our business
                                    partners to offer you certain products,
                                    services, or promotions.
                                </li>
                                <li>
                                    <strong>Other Users.</strong> When you share
                                    personal information (for example, by
                                    posting comments, contributions, or other
                                    content to the Services) or otherwise
                                    interact with public areas of the Services,
                                    such personal information may be viewed by
                                    all users and may be publicly made available
                                    outside the Services in perpetuity.
                                    Similarly, other users will be able to view
                                    descriptions of your activity, communicate
                                    with you witin our Services, and view your
                                    profile.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        id='inforetain'
                        style={{ lineHeight: '1.5', fontSize: '15 px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                4. HOW LONG DO WE KEEP YOUR INFORMATION?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> We keep your
                                    information for as long as necessary to
                                    fulfill the purposes outlined in this
                                    privacy notice unless otherwise required by
                                    law.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We will only keep your personal information for
                                as long as it is necessary for the purposes set
                                out in this privacy notice, unless a longer
                                retention period is required or permitted by law
                                (such as tax, accounting, or other legal
                                requirements). No purpose in this notice will
                                require us keeping your personal information for
                                longer than the period of time in which users
                                have an account with us.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                When we have an ongoing legitimate business need
                                to process your personal information, we will
                                either delete or anonymize such information, or,
                                if this is not possible (for example, because
                                your personal information has been stored in
                                backup archives), then we will securely store
                                your personal information and isolate it from
                                any further processing until deletion is
                                possible.
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='infosafe'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                5. HOW DO WE KEEP YOUR INFORMATION SAFE?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> We aim to protect
                                    your personal information through a system
                                    of organizational and technical security
                                    measures.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We have implemented appropriate and reasonable
                                technical and organizational security measures
                                designed to protect the security of any personal
                                information we process. However, despite our
                                safeguards and efforts to secure your
                                information, no electronic transmission over the
                                Internet or information storage technology can
                                be guaranteed to be 100% secure, so we cannot
                                promise or guarantee that hackers,
                                cybercriminals, or other unauthorized third
                                parties will not be able to defeat our security
                                and improperly collect, access, steal, or modify
                                your information. Although we will do our best
                                to protect your personal information,
                                transmission of personal information to and from
                                our Services is at your own risk. You should
                                only access the Services within a secure
                                environment.
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='infominors'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                6. DO WE COLLECT INFORMATION FROM MINORS?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> We do not
                                    knowingly collect data from or market to
                                    children under 18 years of age.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We do not knowingly solicit data from or market
                                to children under 18 years of age. By using the
                                Services, you represent that you are at least 18
                                or that you are the parent or guardian of such a
                                minor and consent to such minor dependent’s use
                                of the Services. If we learn that personal
                                information from users less than 18 years of age
                                has been collected, we will deactivate the
                                account and take reasonable measures to promptly
                                delete such data from our records. If you become
                                aware of any data we may have collected from
                                children under age 18, please contact us at{' '}
                                <a
                                    href='mailto: admin@cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    admin@cydoc.ai
                                </a>
                                .
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div id='privacyrights'>
                        <span style={stylingObject.heading_1}>
                            <strong>7. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> You may review,
                                    change, or terminate your account at any
                                    time.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you are located in the EEA or UK and you
                                believe we are unlawfully processing your
                                personal information, you also have the right to
                                complain to your local data protection
                                supervisory authority. You can find their
                                contact details here:
                                <a
                                    href='https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html'
                                    style={stylingObject.link}
                                >
                                    https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html
                                </a>
                                .
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you are located in Switzerland, the contact
                                details for the data protection authorities are
                                available here:{' '}
                                <a href='https://www.edoeb.admin.ch/edoeb/en/home.html'>
                                    https://www.edoeb.admin.ch/edoeb/en/home.html
                                </a>
                                .
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    <u>Withdrawing your consent:</u>
                                </strong>{' '}
                                If we are relying on your consent to process
                                your personal information, which may be express
                                and/or implied consent depending on the
                                applicable law, you have the right to withdraw
                                your consent at any time. You can withdraw your
                                consent at any time by contacting us by using
                                the contact details provided in the section "
                                <a href='#contact' style={stylingObject.link}>
                                    HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                                </a>
                                " below.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                However, please note that this will not affect
                                the lawfulness of the processing before its
                                withdrawal, nor when applicable law allows, will
                                it affect the processing of your personal
                                information conducted in reliance on lawful
                                processing grounds other than consent.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    <u>
                                        Opting out of marketing and promotional
                                        communications:
                                    </u>
                                </strong>{' '}
                                You can unsubscribe from our marketing and
                                promotional communications at any time by
                                clicking on the unsubscribe link in the emails
                                that we send, replying "STOP" or "UNSUBSCRIBE"
                                to the SMS messages that we send, or by
                                contacting us using the details provided in the
                                section "
                                <a href='#contact' style={stylingObject.link}>
                                    HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                                </a>
                                " below. You will then be removed from the
                                marketing lists. However, we may still
                                communicate with you — for example, to send you
                                service-related messages that are necessary for
                                the administration and use of your account, to
                                respond to service requests, or for other
                                non-marketing purposes.
                            </span>
                        </div>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span style={stylingObject.heading_2}>
                                <strong>Account Information</strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you would at any time like to review or
                                change the information in your account or
                                terminate your account, you can:
                            </span>
                            <ul>
                                <li>
                                    Log in to your account settings and update
                                    your user account.
                                </li>
                                <li>
                                    Contact us using the contact information
                                    provided.
                                </li>
                            </ul>
                            <span>
                                Upon your request to terminate your account, we
                                will deactivate or delete your account and
                                information from our active databases. However,
                                we may retain some information in our files to
                                prevent fraud, troubleshoot problems, assist
                                with any investigations, enforce our legal terms
                                and/or comply with applicable legal
                                requirements.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you have questions or comments about your
                                privacy rights, you may email us at{' '}
                                <a
                                    href='mailto: admin@cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    admin@cydoc.ai
                                </a>
                                .
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='DNT'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                8. CONTROLS FOR DO-NOT-TRACK FEATURES
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <span style={stylingObject.body_text}>
                            Most web browsers and some mobile operating systems
                            and mobile applications include a Do-Not-Track
                            ("DNT") feature or setting you can activate to
                            signal your privacy preference not to have data
                            about your online browsing activities monitored and
                            collected. At this stage no uniform technology
                            standard for recognizing and implementing DNT
                            signals has been finalized. As such, we do not
                            currently respond to DNT browser signals or any
                            other mechanism that automatically communicates your
                            choice not to be tracked online. If a standard for
                            online tracking is adopted that we must follow in
                            the future, we will inform you about that practice
                            in a revised version of this privacy notice.
                        </span>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='caresidents'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span style={stylingObject.heading_1}>
                            <strong>
                                9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY
                                RIGHTS?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> Yes, if you are a
                                    resident of California, you are granted
                                    specific rights regarding access to your
                                    personal information.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                California Civil Code Section 1798.83, also
                                known as the "Shine The Light" law, permits our
                                users who are California residents to request
                                and obtain from us, once a year and free of
                                charge, information about categories of personal
                                information (if any) we disclosed to third
                                parties for direct marketing purposes and the
                                names and addresses of all third parties with
                                which we shared personal information in the
                                immediately preceding calendar year. If you are
                                a California resident and would like to make
                                such a request, please submit your request in
                                writing to us using the contact information
                                provided below.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you are under 18 years of age, reside in
                                California, and have a registered account with
                                Services, you have the right to request removal
                                of unwanted data that you publicly post on the
                                Services. To request removal of such data,
                                please contact us using the contact information
                                provided below and include the email address
                                associated with your account and a statement
                                that you reside in California. We will make sure
                                the data is not publicly displayed on the
                                Services, but please be aware that the data may
                                not be completely or comprehensively removed
                                from all our systems (e.g., backups, etc.).
                            </span>
                        </div>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span style={stylingObject.heading_2}>
                                <strong>CCPA Privacy Notice</strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                The California Code of Regulations defines a
                                "resident" as:{' '}
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span style={{ marginLeft: '20px' }}>
                                (1) every individual who is in the State of
                                California for other than a temporary or
                                transitory purpose and
                            </span>
                            <br />
                            <span style={{ marginLeft: '20px' }}>
                                (2) every individual who is domiciled in the
                                State of California who is outside the State of
                                California for a temporary or transitory purpose
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                All other individuals are defined as
                                "non-residents."
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If this definition of "resident" applies to you,
                                we must adhere to certain rights and obligations
                                regarding your personal information.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    What categories of personal information do
                                    we collect?
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We have collected the following categories of
                                personal information in the past twelve (12)
                                months:
                            </span>
                            <div>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    <strong>Category</strong>
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    <strong>Examples</strong>
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>
                                                    <strong>Collected</strong>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>A. Identifiers</span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Contact details, such as
                                                    real name, alias, postal
                                                    address, telephone or mobile
                                                    contact number, unique
                                                    personal identifier, online
                                                    identifier, Internet
                                                    Protocol address, email
                                                    address, and account name
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    B. Personal information
                                                    categories listed in the
                                                    California Customer Records
                                                    statute
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Name, contact information,
                                                    education, employment,
                                                    employment history, and
                                                    financial information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    C. Protected classification
                                                    characteristics under
                                                    California or federal law
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Gender and date of birth
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    D. Commercial information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Transaction information,
                                                    purchase history, financial
                                                    details, and payment
                                                    information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>NO</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    E. Biometric information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Fingerprints and voiceprints
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>NO</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    F. Internet or other similar
                                                    network activity
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Browsing history, search
                                                    history, online behavior,
                                                    interest data, and
                                                    interactions with our and
                                                    other websites,
                                                    applications, systems, and
                                                    advertisements
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>NO</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>G. Geolocation data</span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>Device location</span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    H. Audio, electronic,
                                                    visual, thermal, olfactory,
                                                    or similar information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Images and audio, video or
                                                    call recordings created in
                                                    connection with our business
                                                    activities
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>NO</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    I. Professional or
                                                    employment-related
                                                    information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Business contact details in
                                                    order to provide you our
                                                    services at a business level
                                                    or job title, work history,
                                                    and professional
                                                    qualifications if you apply
                                                    for a job with us
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    J. Education Information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Student records and
                                                    directory information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>NO</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: '33.33%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    K. Inferences drawn from
                                                    other personal information
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '51.44%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                }}
                                            >
                                                <span>
                                                    Inferences drawn from any of
                                                    the collected personal
                                                    information listed above to
                                                    create a profile or summary
                                                    about, for example, an
                                                    individual's preferences and
                                                    characteristics
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    width: '15.23%',
                                                    borderLeft:
                                                        '1px solid black',
                                                    borderRight:
                                                        '1px solid black',
                                                    borderTop:
                                                        '1px solid black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <span>YES</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We may also collect other personal information
                                outside of these categories instances where you
                                interact with us in person, online, or by phone
                                or mail in the context of:
                            </span>
                            <ul>
                                <li>
                                    Receiving help through our customer support
                                    channels
                                </li>
                                <li>
                                    Participation in customer surveys or
                                    contests and
                                </li>
                                <li>
                                    Facilitation in the delivery of our Services
                                    and to respond to your inquiries.
                                </li>
                            </ul>
                            <span>
                                <strong>
                                    How do we use and share your personal
                                    information?
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                More information about our data collection and
                                sharing practices can be found in this privacy
                                notice.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                You may contact us by email at{' '}
                                <a
                                    href='mailto:admin@cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    admin@cydoc.ai
                                </a>
                                , or by referring to the contact details at the
                                bottom of this document.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                If you are using an authorized agent to exercise
                                your right to opt out we may deny a request if
                                the authorized agent does not submit proof that
                                they have been validly authorized to act on your
                                behalf.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    Will your information be shared with anyone
                                    else?
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We may disclose your personal information with
                                our service providers pursuant to a written
                                contract between us and each service provider.
                                Each service provider is a for-profit entity
                                that processes the information on our behalf.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We may use your personal information for our own
                                business purposes, such as for undertaking
                                internal research for technological development
                                and demonstration. This is not considered to be
                                "selling" of your personal information.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                Cydoc, LLC has not disclosed or sold any
                                personal information to third parties for a
                                business or commercial purpose in the preceding
                                twelve (12) months. Cydoc, LLC will not sell
                                personal information in the future belonging to
                                website visitors, users, and other consumers.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <strong>
                                    Your rights with respect to your personal
                                    data
                                </strong>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <u>
                                    Right to request deletion of the data —
                                    Request to delete
                                </u>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                You can ask for the deletion of your personal
                                information. If you ask us to delete your
                                personal information, we will respect your
                                request and delete your personal information,
                                subject to certain exceptions provided by law,
                                such as (but not limited to) the exercise by
                                another consumer of his or her right to free
                                speech, our compliance requirements resulting
                                from a legal obligation, or any processing that
                                may be required to protect against illegal
                                activities.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <u>Right to be informed — Request to know</u>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                Depending on the circumstances, you have a right
                                to know:
                            </span>
                            <ul>
                                <li>
                                    whether we collect and use your personal
                                    information
                                </li>
                                <li>
                                    the categories of personal information that
                                    we collect
                                </li>
                                <li>
                                    the purposes for which the collected
                                    personal information is used
                                </li>
                                <li>
                                    whether we sell your personal information to
                                    third parties
                                </li>
                                <li>
                                    the categories of personal information that
                                    we sold or disclosed for a business purpose
                                </li>
                                <li>
                                    the categories of third parties to whom the
                                    personal information was sold or disclosed
                                    for a business purpose and
                                </li>
                                <li>
                                    he business or commercial purpose for
                                    collecting or selling personal information
                                </li>
                            </ul>
                            <span>
                                In accordance with applicable law, we are not
                                obligated to provide or delete consumer
                                information that is de-identified in response to
                                a consumer request or to re-identify individual
                                data to verify a consumer request.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <u>
                                    Right to Non-Discrimination for the Exercise
                                    of a Consumer's Privacy Rights
                                </u>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We will not discriminate against you if you
                                exercise your privacy rights.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <u>Verification process</u>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                Upon receiving your request, we will need to
                                verify your identity to determine you are the
                                same person about whom we have the information
                                in our system. These verification efforts
                                require us to ask you to provide information so
                                that we can match it with information you have
                                previously provided us. For instance, depending
                                on the type of request you submit, we may ask
                                you to provide certain information so that we
                                can match the information you provide with the
                                information we already have on file, or we may
                                contact you through a communication method
                                (e.g., phone or email) that you have previously
                                provided to us. We may also use other
                                verification methods as the circumstances
                                dictate.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We will only use personal information provided
                                in your request to verify your identity or
                                authority to make the request. To the extent
                                possible, we will avoid requesting additional
                                information from you for the purposes of
                                verification. However, if we cannot verify your
                                identity from the information already maintained
                                by us, we may request that you provide
                                additional information for the purposes of
                                verifying your identity and for security or
                                fraud-prevention purposes. We will delete such
                                additionally provided information as soon as we
                                finish verifying you.
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                <u>Other privacy rights</u>
                            </span>
                            <ul>
                                <li>
                                    You may object to the processing of your
                                    personal information.
                                </li>
                                <li>
                                    You may request correction of your personal
                                    data if it is incorrect or no longer
                                    relevant, or ask to restrict the processing
                                    of the information.
                                </li>
                                <li>
                                    You can designate an authorized agent to
                                    make a request under the CCPA on your
                                    behalf. We may deny a request from an
                                    authorized agent that does not submit proof
                                    that they have been validly authorized to
                                    act on your behalf in accordance with the
                                    CCPA.
                                </li>
                                <li>
                                    You may request to opt out from future
                                    selling of your personal information to
                                    third parties. Upon receiving an opt-out
                                    request, we will act upon the request as
                                    soon as feasibly possible, but no later than
                                    fifteen (15) days from the date of the
                                    request submission.
                                </li>
                            </ul>
                            <span>
                                To exercise these rights, you can contact us by
                                email at{' '}
                                <a
                                    href='www.cydoc.ai'
                                    style={stylingObject.link}
                                >
                                    admin@cydoc.ai
                                </a>
                                , or by referring to the contact details at the
                                bottom of this document. If you have a complaint
                                about how we handle your data, we would like to
                                hear from you.
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='policyupdates'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span id='control' style={stylingObject.heading_1}>
                            <strong>
                                10. DO WE MAKE UPDATES TO THIS NOTICE?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <div style={stylingObject.body_text}>
                            <span>
                                <em>
                                    <strong>In Short:</strong> Yes, we will
                                    update this notice as necessary to stay
                                    compliant with relevant laws.
                                </em>
                            </span>
                            <span>
                                <br />
                                <br />
                            </span>
                            <span>
                                We may update this privacy notice from time to
                                time. The updated version will be indicated by
                                an updated "Revised" date and the updated
                                version will be effective as soon as it is
                                accessible. If we make material changes to this
                                privacy notice, we may notify you either by
                                prominently posting a notice of such changes or
                                by directly sending you a notification. We
                                encourage you to review this privacy notice
                                frequently to be informed of how we are
                                protecting your information.
                            </span>
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='contact'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span id='control' style={stylingObject.heading_1}>
                            <strong>
                                11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <span>
                            If you have questions or comments about this notice,
                            you may contact our Data Protection Officer (DPO),
                            Rachel Draelos, MD, PhD, by email at{' '}
                            <a
                                href='mailto: admin@cydoc.ai'
                                style={stylingObject.link}
                            >
                                admin@cydoc.ai
                            </a>
                            , or by post to:
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <span>Cydoc, LLC</span>
                        <br />
                        <span>Rachel Draelos, MD, PhD</span>
                        <br />
                        <span>__________</span>
                        <br />
                        <span>Durham, NC 27705</span>
                        <br />
                        <span>United States</span>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div
                        id='request'
                        style={{ lineHeight: '1.5', fontSize: '15px' }}
                    >
                        <span id='control' style={stylingObject.heading_1}>
                            <strong>
                                12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE
                                DATA WE COLLECT FROM YOU?
                            </strong>
                        </span>
                        <span>
                            <br />
                            <br />
                        </span>
                        <span>
                            Based on the applicable laws of your country, you
                            may have the right to request access to the personal
                            information we collect from you, change that
                            information, or delete it. To request to review,
                            update, or delete your personal information, please
                            visit:
                            <a href='www.cydoc.ai' style={stylingObject.link}>
                                {' '}
                                www.cydoc.ai
                            </a>
                            .
                        </span>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span>
                        This privacy policy was created using Termly's{' '}
                        <a
                            href='https://termly.io/products/privacy-policy-generator/'
                            style={stylingObject.link}
                        >
                            Privacy Policy Generator
                        </a>
                        .
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={{ color: 'rgb(127, 127, 127)' }}>
                        <strong>Last updated July 11, 2022</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};
{
    /* eslint-enable */
}
export default Policy;
