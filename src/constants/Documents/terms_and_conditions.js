import React from 'react';
import NavMenu from '../../components/navigation/NavMenu';

{
    /* eslint-disable */
}
const stylingObject = {
    body: {
        background: 'transparent',
        fontFamily: 'Arial',
        color: '#595959',
        fontSize: '15px',
        lineHeight: '1.5',
    },
    title: {
        marginTop: '2em',
        marginBottom: '1em',
        fontFamily: 'Arial',
        fontSize: '26px',
        color: '#000000',
    },
    heading_1: {
        fontFamily: 'Arial',
        fontSize: '19px',
        color: '#000000',
    },
    body_text: {
        color: '#595959',
        fontSize: '15px',
        fontFamily: 'Arial',
        lineHeight: '1.5',
    },
    link: {
        color: '#3030F1',
        fontSize: '15px',
        fontFamily: 'Arial',
        wordBreak: 'break-word',
    },
};
const Title = () => {
    return (
        <div style={stylingObject.title}>Terms and Conditions of Service</div>
    );
};

const Terms_and_conditions = (props) => {
    return (
        <div style={stylingObject.body}>
            {props.title ? null : <NavMenu />}
            <div
                style={{
                    marginLeft: '3em',
                    marginRight: '3em',
                    marginBottom: '3em',
                }}
            >
                {props.title ? null : <Title />}
                <span style={{ color: 'rgb(89,89,89)', fontSize: '14px' }}>
                    This Terms and Conditions of Service ("Agreement") is a
                    binding agreement between you ("<strong>End User</strong>" "
                    <strong>you</strong>" or "<strong>your</strong>") and Cydoc,
                    LLC ("<strong>Company</strong>" "<strong>we</strong>" or "
                    <strong>us</strong>"), and governs your use of the Cydoc
                    Service.
                </span>
                <span>
                    <br />
                    <br />
                </span>
                <span style={{ marginLeft: '20px' }}>
                    YOU MUST READ THE BELOW IN ITS ENTIRETY BEFORE PROCEEDING TO
                    ACCESS THE CYDOC SERVICE OR ANY TECHNOLOGY PROVIDED THROUGH
                    THE CYDOC SERVICE. THIS AGREEMENT FORMS A BINDING CONTRACT
                    BETWEEN YOU AND US WHEN ACCEPTED BY YOU. YOU ACCEPT THIS
                    AGREEMENT BY: (1) ACCESSING OR USING THE CYDOC SERVICE OR
                    ANY TECHNOLOGY PROVIDED THROUGH THE SERVICE; (2) INDICATING
                    ACCEPTANCE OF THIS AGREEMENT WHEN IT IS PRESENTED ONLINE,
                    SUCH AS BY CHECKING A BOX CAPTIONED WITH ACCEPTANCE LANGUAGE
                    OR CLICKING AN ICON BEARING AN “ACCEPT” OR SIMILAR LEGEND OR
                    BY OTHERWISE ELECTRONICALLY SIGNING THIS AGREEMENT; OR (3)
                    EXERCISING OR PURPORTING TO EXERCISE ANY OF THE RIGHTS
                    GRANTED TO YOU UNDER THIS AGREEMENT. THE INDIVIDUAL
                    ACCEPTING THIS AGREEMENT ON BEHALF OF AN ENTITY REPRESENTS
                    THAT HE OR SHE HAS AUTHORITY TO REPRESENT THE ENTITY AND
                    CREATE A LEGALLY BINDING CONTRACT. IF YOU DO NOT AGREE TO
                    THIS AGREEMENT OR HAVE SUCH AUTHORITY, YOU MAY NOT USE THE
                    CYDOC SERVICE.
                </span>
                <span>
                    <br />
                    <br />
                </span>
                <span style={{ marginLeft: '20px' }}>
                    <strong>Background:</strong>
                </span>
                <ul>
                    <li>
                        The Cydoc Service allows you to generate a text note
                        based on case-specific information (e.g., about a
                        particular patient) that you provide to the Cydoc
                        Service.
                    </li>
                    <li>
                        The Cydoc Service is delivered solely through your
                        computing device, through an instance of our software
                        that is loaded to your computer browser.
                    </li>
                    <li>
                        Once you close your computer browser, the Cydoc Service
                        (and the current instance of our software deployed to
                        your computing device) ends, and the text note that you
                        generated is no longer accessible. If you have not saved
                        the text note, it will be lost. To avoid losing your
                        work, you must copy and paste the text note to its
                        ultimate destination prior to closing your browser.
                    </li>
                    <li>
                        If you want to generate a new text note, you will need
                        to initiate the Cydoc Service through a new or refreshed
                        computer browser session.
                    </li>
                    <li>
                        Our software runs exclusively on your computing device.
                        The information you enter to generate a case-specific
                        text note is Your Data (as described below), and remains
                        on your computing device. Cydoc does not process or
                        otherwise access Your Data for purposes of generating a
                        text note.
                    </li>
                    <li>
                        <strong>
                            Cydoc does not access, view, transmit, or otherwise
                            process the information that you enter into the
                            browser of your computing device to generate a
                            case-specific text note.
                        </strong>
                    </li>
                </ul>
                <ol style={{ lineHeight: '1.5' }}>
                    <li id='definitions' style={stylingObject.heading_1}>
                        <u>Definitions</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Access Credentials</strong>" means your name,
                        identification number, password, license or security
                        key, security token, PIN or other security code, method,
                        technology or device used, alone or in combination, to
                        verify your identity and authorization to access and use
                        the service.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Cydoc Materials</strong>" means the software,
                        systems, and any and all other information, data,
                        documentation, and other content that are provided by or
                        on behalf of Cydoc in connections with the Cydoc
                        Service. For the avoidance of doubt, Cydoc Materials
                        include Usage Data and any information, data or other
                        content derived from Cydoc's monitoring of your access
                        to or use of the Cydoc Service, but do not include Your
                        Data.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Cydoc Service</strong>" means the deployment of
                        software to the browser of the computing device through
                        which you initiate our service. For clarity, individual
                        instances of the Cydoc Service end each time you end
                        your browser session on your computing device.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Intellectual Property Rights</strong>" means
                        any and all registered and unregistered rights granted,
                        applied for or otherwise now or hereafter in existence
                        under or related to any patent, copyright, trademark,
                        trade secret, database protection or other intellectual
                        property rights laws, and all similar or equivalent
                        rights or forms of protection, in any part of the world.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Usage Data</strong>" means non-personally
                        identifiable data and information related to the
                        operation and access of the Cydoc Service.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Software</strong>" means the software that is
                        provided to you under the Cydoc Service
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Your Data</strong>" means information, data and
                        other content that you enter for purposes of generating
                        a particular instance of a text note (e.g., a
                        case-specific text note) under the Cydoc Service, which
                        may, at your discretion, include personally identifiable
                        data. Cydoc does not access, view, transmit, or
                        otherwise process Your Data, and we ask that you not
                        provide Cydoc Your Data. For the avoidance of doubt,
                        Your Data does not include Usage Data.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Template Data</strong>" means information, data
                        and other content that you enter into any template
                        creation user interface on the Cydoc website for the
                        purpose of specifying a particular template,
                        questionnaire, form, knowledge graph, or other user
                        interface for note generation under the Cydoc Service.
                        Template Data is for the purpose of generating template
                        questions and user interfaces, and does not require Your
                        Data (or any personally identifiable data), and we
                        require that you not input Your Data (or any personally
                        identifiable data) into the portion of the Cydoc website
                        used to enter Template Data. Cydoc stores Template Data
                        to make it available for note generation purposes under
                        the Cydoc Service.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        "<strong>Your Systems</strong>" means your information
                        technology, including computers (and associated
                        browsers), software, hardware, databases, electronic
                        systems (including database management systems) and
                        networks, whether operated directly by you or through
                        the use of a third-party service.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='access' style={stylingObject.heading_1}>
                        <u>Access to the Cydoc Service</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='2.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            2.1 <u>Access and Use</u>.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        (a) <u>Cydoc Service License</u>.&emsp;Subject to and
                        conditioned on your compliance with the terms and
                        conditions of this Agreement, Cydoc hereby grants you a
                        personal, non-exclusive, non-transferable right to
                        access and use the Cydoc Service during the term of this
                        Agreement, in accordance with the terms and conditions
                        herein. Such use is limited to your internal,
                        non-commercial purposes. As needed, Cydoc will provide
                        you with Access Credentials within a reasonable time
                        following your acceptance of this Agreement.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        (b) <u>License to Template Data</u>.&emsp;Our website
                        provides an area where you may choose to provide Cydoc
                        with questions, sentences, phrases, and/or other user
                        interface specifications that can be used to initiate
                        the note generation process (for example, “Do you have
                        chest pain?”). This data, which does not identify a
                        person, is referred to as Template Data. If you submit
                        or otherwise provide us any with Template Data, or other
                        ideas, concepts or other feedback, you hereby
                        irrevocably grant to us an unrestricted, worldwide,
                        perpetual, sublicensable (through multiple tiers),
                        royalty-free license to use, reproduce, display
                        publicly, perform, publish, transmit, distribute and
                        otherwise exploit such data in any medium and for any
                        purpose, and you further agree that we are free to use
                        any ideas, concepts or know-how that you or individuals
                        acting on your behalf provide to us in accordance with
                        the foregoing license grant. You further irrevocably
                        waive any “moral rights” or other rights with respect to
                        attribution of authorship or integrity of materials
                        regarding materials, ideas, concepts or know-how
                        provided to us that you may have under any applicable
                        law under any legal theory. You agree that you will not
                        submit to Company any information or ideas that you
                        consider to be confidential or proprietary.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='2.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            2.2 <u>Disclaimer</u>.&emsp;CYDOC IS NOT PROVIDING
                            MEDICAL OR PROFESSIONAL ADVICE. THE CYDOC SERVICE
                            PROVIDES A TOOL THAT ALLOWS YOU TO GENERATE YOUR OWN
                            TEXT NOTES. YOU ARE SOLELY RESPONSIBLE, AND YOU
                            SHALL RELY ON YOUR OWN PERSONNEL FOR (I) THE
                            ACCURACY OF THE INFORMATION ENTERED TO THE CYDOC
                            SERVICE, (II) OBTAINING ALL RIGHTS AND
                            AUTHORIZATIONS NECESSARY TO USE SUCH INFORMATION
                            UNDER THE CYDOC SERVICE, AND (III) ALL CONCLUSIONS
                            AND RESULTS FROM YOUR USE OF THE CYDOC SERVICE, AND
                            (IV) YOUR FAILURE TO IDENTIFY AND CORRECT ANY
                            INACCURACIES AND/OR ERRORS IN THE CONTENT, RESULTS,
                            OR OUTPUT OF THE CYDOC SERVICE.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='2.3' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            2.3 <u>Changes</u>.&emsp;Cydoc reserves the right,
                            in its sole discretion, to make any changes to the
                            Cydoc Service and Cydoc Materials that it deems
                            necessary or useful to maintain or enhance the Cydoc
                            Service generally or to comply with applicable law.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='2.4' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            2.4 <u>Suspension or Termination of Service</u>
                            .&emsp;Cydoc may, directly or indirectly, suspend,
                            terminate or otherwise deny access to or use of all
                            or any part of the Cydoc Service or Cydoc Materials,
                            without incurring any resulting obligation or
                            liability, if: (a) Cydoc receives a judicial or
                            other governmental demand or order, subpoena or law
                            enforcement request that expressly or by reasonable
                            implication requires Cydoc to do so; or (b) Cydoc
                            believes, in its reasonable discretion, that: (i)
                            you have failed to comply with any material term of
                            this Agreement, or accessed or used the Cydoc
                            Service beyond the scope of the rights granted or
                            for a purpose not authorized under this Agreement;
                            (ii) you are, have been or are likely to be involved
                            in any fraudulent, misleading or unlawful activities
                            relating to or in connection with any of the Cydoc
                            Service; or (iii) this Agreement expires or is
                            terminated. This Section 2.4 does not limit any of
                            Cydoc's other rights or remedies, whether at law, in
                            equity or under this Agreement.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='userestrictions' style={stylingObject.heading_1}>
                        <u>Use Restrictions:</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='3.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            3.1&emsp;You shall not, and shall not permit any
                            third party to, access or use the Cydoc Service or
                            Cydoc Materials except as expressly permitted by
                            this Agreement. For purposes of clarity and without
                            limiting the generality of the foregoing, you shall
                            not, except as this Agreement expressly permits: (a)
                            copy, modify or create derivative works or
                            improvements of the Cydoc Service or Cydoc
                            Materials; (b) rent, lease, lend, sell, sublicense,
                            assign, distribute, publish, transfer or otherwise
                            make available the Cydoc Service or Cydoc Materials
                            to any third party, including on or in connection
                            with the internet or any time-sharing, service
                            bureau, software as a service, cloud or other
                            technology or service; (c) reverse engineer,
                            disassemble, decompile, decode, adapt or otherwise
                            attempt to derive or gain access to the source code
                            of the Cydoc Service or Cydoc Materials, in whole or
                            in part; (d) bypass or breach any security device or
                            protection used by the Cydoc Service or Cydoc
                            Materials or access or use the Cydoc Service or
                            Cydoc Materials other through the use of your own
                            then valid Access Credentials; (e) input, upload,
                            transmit or otherwise provide to or through the
                            Cydoc Service, any information or materials that are
                            unlawful or injurious, or contain, transmit or
                            activate any virus, worm, malware or other malicious
                            computer code, the purpose or effect of which is to
                            (f) permit unauthorized access to, or to destroy,
                            disrupt, disable, distort or otherwise harm or
                            impede in any manner any (i) computer, software,
                            firmware, hardware, system or network; or (ii) any
                            application or function of any of the foregoing or
                            the security, integrity, confidentiality or use of
                            any data processed thereby; or (ii) prevent any
                            access or use of the Cydoc Service; (g) damage,
                            destroy, disrupt, disable, impair, interfere with or
                            otherwise impede or harm in any manner the Cydoc
                            Service; (h) remove, delete, alter or obscure any
                            trademarks, warranties or disclaimers or any
                            copyright, trademark, patent, or other intellectual
                            property or proprietary rights notices from the
                            Cydoc Service or Cydoc Materials, including any copy
                            thereof; (i) access or use the Cydoc Service or
                            Cydoc Materials in any manner or for any purpose
                            that infringes, misappropriates or otherwise
                            violates any Intellectual Property Right or other
                            right of any third party, or that violates any
                            applicable laws, rules or regulations; (j) access or
                            use the Cydoc Service or Cydoc Materials for
                            purposes of competitive analysis of the Cydoc
                            Service or Cydoc Materials, the development,
                            provision, or use of a competing software service or
                            product or any other purpose that is to Cydoc's
                            detriment or commercial disadvantage; (k) use the
                            Cydoc Service on any third-party site in violation
                            of the third party's websites terms of use or
                            privacy policy, or for the unauthorized collection
                            of personally identifiable information; or (l)
                            otherwise access or use the Cydoc Service or Cydoc
                            Materials beyond the scope of the authorization
                            granted under{' '}
                            <a href='#2.1' style={stylingObject.link}>
                                Section 2.1
                            </a>
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='3.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            3.2 <u>Cydoc Systems and Security Obligations</u>
                            .&emsp;Cydoc does not access, view, transmit, or
                            otherwise process the information that you enter
                            into the browser of your computing device to
                            generate a particular instance of a text note, and
                            we ask that you not provide such information to
                            Cydoc. Cydoc shall have no liability for any such
                            access, view, transmission, or processing of such
                            information, all of which is your sole
                            responsibility and liability.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='obligations' style={stylingObject.heading_1}>
                        <u>Your Obligations</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='4.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            4.1 <u>Your Systems and Cooperation</u>.&emsp;You
                            shall at all times during the Term: (a) set up,
                            maintain and operate in good repair all Your Systems
                            on or through which the Cydoc Service is accessed or
                            used; and (b) retain sole control over the
                            operation, maintenance and management of, and all
                            access to and use of, Your Systems, and sole
                            responsibility for all access to and use of Cydoc
                            Materials by any third party by or through Your
                            Systems or any other means controlled by you,
                            including any: (i) information, instructions or
                            materials provided by you to the Cydoc Service or
                            Cydoc; (ii) results obtained from any use of the
                            Cydoc Service or Cydoc Materials; and (iii)
                            conclusions, decisions or actions based on such use.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='4.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            4.2 <u>Corrective Action and Notice</u>.&emsp;If you
                            become aware of any actual or threatened activity
                            prohibited by{' '}
                            <a
                                href='#userestrictions'
                                style={stylingObject.link}
                            >
                                Section 3
                            </a>
                            , you shall immediately: (a) take all reasonable and
                            lawful measures within your control that are
                            necessary to stop the activity or threatened
                            activity and to mitigate its effects (including,
                            where applicable, by discontinuing and preventing
                            any unauthorized access to the Cydoc Service or
                            Cydoc Materials and permanently erasing from your
                            systems and destroying any data to which any of them
                            have gained unauthorized access); and (b) notify
                            Cydoc of any such actual or threatened activity.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='Security' style={stylingObject.heading_1}>
                        <u>Security</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='5.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            5.1 <u>Your Control and Responsibility</u>.&emsp;You
                            have and will retain sole responsibility for: (a)
                            all data you provide in connection with your
                            subscription to or use of the Cydoc Service,
                            including without limitation Your Data, including
                            its content and use; (b) all information,
                            instructions and materials provided in connection
                            with your use of the Cydoc Service; (c) Your
                            Systems; (d) the security and use of your Access
                            Credentials; and (e) all access to and use of the
                            Cydoc Service and Cydoc Materials directly or
                            indirectly by or through Your Systems, including all
                            results obtained from, and all conclusions,
                            decisions and actions based on, such access or use.
                            You shall employ all physical, administrative and
                            technical controls, screening and security
                            procedures and other safeguards necessary to: (i)
                            protect against any unauthorized access to or use of
                            the Cydoc Service; (ii) use strong password creation
                            and protection practices; and (iii) control the
                            content and use of Your Data, such that the Cydoc
                            Service is used for lawful purposes that comply with
                            all applicable federal, state and foreign privacy
                            and data protection Laws. Please report system
                            availability or other system issues (security or
                            otherwise) to Cydoc Support by emailing{' '}
                            <a
                                href='mailto: admin@cydoc.ai'
                                style={stylingObject.link}
                            >
                                admin@cydoc.ai
                            </a>
                            .
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='feesandpayment' style={stylingObject.heading_1}>
                        <u>Fees and Payment</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='6.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            6.1 <u>Fees and Payment</u>.&emsp;You shall pay
                            Cydoc the fees set forth in each Order Form (“Fees”)
                            in accordance with this Section 6. Unless otherwise
                            specified in the applicable Order Form, Customer
                            shall pay all Fees, as described on the Order Form
                            for the applicable service tier, via credit card at
                            the time of signup, in which case Customer's credit
                            card will be billed immediately or as otherwise
                            indicated on the Order Form. If the Fees are
                            recurring over designated time periods stated on an
                            Order Form, then payment is due prior to the start
                            of each subscription period, and the credit card on
                            file will be charged at the start of each pay
                            period. Customer shall make all payments hereunder
                            in US dollars by credit card. If Customer fails to
                            make any payment when due then, pursuant to
                            <a
                                href='#survivingterms'
                                style={stylingObject.link}
                            >
                                {' '}
                                Section 12
                            </a>
                            , Cydoc may terminate this Agreement immediately and
                            without liability or notice to Customer.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='6.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            6.2 <u>Auto-Renewal</u>.&emsp;Unless otherwise
                            specified in the applicable Order Form, your credit
                            card will be billed at signup. YOU EXPRESSLY
                            ACKNOWLEDGE AND AGREE THAT (A) YOUR SUBSCRIPTION
                            WILL AUTO-RENEW FOR ANOTHER TERM OF THE SAME LENGTH
                            AS THE INITIAL TERM AT THE APPLICABLE TIER LEVEL,
                            (B) CYDOC (OR OUR THIRD-PARTY PAYMENT PROCESSOR) IS
                            AUTHORIZED TO CHARGE YOU FOR YOUR SELECTED
                            SUBSCRIPTION, IN ADDITION TO ANY APPLICABLE TAXES
                            AND OTHER CHARGES, FOR AS LONG AS YOUR SUBSCRIPTION
                            CONTINUES, AND (C) YOUR SUBSCRIPTION IS CONTINUOUS
                            UNTIL YOU CANCEL IT OR UNTIL CYDOC SUSPENDS OR STOPS
                            PROVIDING ACCESS TO THE SERVICES OR SUBSCRIPTION IN
                            ACCORDANCE WITH THESE TERMS. YOU MAY CANCEL YOUR
                            SUBSCRIPTION ELECTRONICALLY VIA THE SUBSCRIPTION
                            CANCELLATION USER INTERFACE PROVIDED ON THE SITE. IF
                            YOU CANCEL BEFORE THE EXPIRATION DATE OF YOUR
                            CURRENT SUBSCRIPTION, YOU WILL NOT BE ENTITLED TO A
                            REFUND OF ANY AMOUNTS THAT YOU HAVE ALREADY PAID, TO
                            THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='6.3' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            6.3 <u>Taxes</u>.&emsp;All Fees and other amounts
                            payable by you under this Agreement are exclusive of
                            taxes and similar assessments. Without limiting the
                            foregoing, you are responsible for all sales, use
                            and excise taxes and any other similar taxes, duties
                            and charges of any kind imposed by any federal,
                            state or local governmental or regulatory authority
                            on any amounts payable by you hereunder, other than
                            any taxes imposed on Cydoc's income.{' '}
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li
                        id='intellectualproperty'
                        style={stylingObject.heading_1}
                    >
                        <u>Intellectual Property Rights</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='7.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            7.1 <u>Cydoc Materials</u>.&emsp;All right, title
                            and interest in and to the Cydoc Service and Cydoc
                            Materials, including all Intellectual Property
                            Rights therein, are and will remain with Cydoc and
                            its suppliers. You have no right, license or
                            authorization with respect to the Cydoc Service or
                            any Cydoc Materials except as expressly set forth in{' '}
                            <a href='#2.1' style={stylingObject.link}>
                                Section 2.1
                            </a>
                            , in each case subject to{' '}
                            <a
                                href='#userestrictions'
                                style={stylingObject.link}
                            >
                                Section 3
                            </a>
                            . All other rights in and to the Cydoc Service and
                            Cydoc Materials are expressly reserved by Cydoc. In
                            furtherance of the foregoing, you hereby
                            unconditionally and irrevocably grant to Cydoc an
                            assignment of all right, title and interest in and
                            to the Usage Data, including all Intellectual
                            Property Rights relating thereto. Nothing in this
                            Agreement grants any right, title or interest in or
                            to (including any license under) any Intellectual
                            Property Rights in or relating to, the Cydoc Service
                            or Cydoc Materials, whether expressly, by
                            implication, estoppel or otherwise.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='7.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            7.2 <u>Your Data</u>.&emsp;As between Customer and
                            Cydoc, you are and will remain the sole and
                            exclusive owner of all right, title and interest in
                            and to all of Your Data, including all Intellectual
                            Property Rights relating thereto.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li
                        id='representationsandwarranties'
                        style={stylingObject.heading_1}
                    >
                        <u>Representations and Warranties</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='8.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            8.1{' '}
                            <u>Representations, Warranties, and Covenants</u>
                            .&emsp;You represent, warrant and covenant to Cydoc
                            that you own or otherwise have and will have the
                            necessary rights and consents in and relating to
                            Your Data so that it does not and will not infringe,
                            misappropriate or otherwise violate any Intellectual
                            Property Rights or any privacy or other rights of
                            any third party, or violate any applicable laws,
                            rules or regulations.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='8.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            8.2 <u>DISCLAIMER OF WARRANTIES</u>.&emsp;ALL CYDOC
                            SERVICE AND CYDOC MATERIALS ARE PROVIDED “AS IS.”
                            CYDOC SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES
                            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                            PURPOSE, TITLE AND NON-INFRINGEMENT AND ALL
                            WARRANTIES ARISING FROM COURSE OF DEALING, USAGE OR
                            TRADE PRACTICE. WITHOUT LIMITING THE FOREGOING,
                            CYDOC MAKES NO WARRANTY OF ANY KIND THAT THE CYDOC
                            SERVICE OR CYDOC MATERIALS, OR ANY PRODUCTS OR
                            RESULTS OF THE USE THEREOF, WILL MEET YOUR OR ANY
                            OTHER PERSON'S REQUIREMENTS, OPERATE WITHOUT
                            INTERRUPTION, ACHIEVE ANY INTENDED RESULT, BE
                            COMPATIBLE OR WORK WITH ANY SOFTWARE, SYSTEM OR
                            OTHER SERVICE, OR BE SECURE, ACCURATE, COMPLETE,
                            FREE OF HARMFUL CODE OR ERROR FREE.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='indemnification' style={stylingObject.heading_1}>
                        <u>Indemnification</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span>
                        <strong>Indemnification</strong>.&emsp;You shall
                        indemnify, defend and hold harmless Cydoc and its
                        officers, directors, employees, agents, successors and
                        assigns (each, a “Cydoc Indemnitee”) from and against
                        any and all losses, damages, deficiencies, claims,
                        actions, judgments, settlements, interest, awards,
                        penalties, fines, costs or expenses of whatever kind,
                        including reasonable attorneys' fees incurred by such
                        Cydoc Indemnitee resulting from any claim, action,
                        lawsuit, costs or actions arising from a claim by a
                        third party (“Claim”) that arise out of or result from,
                        or are alleged to arise out of or result from: (a) Your
                        Data; (b) any other materials or information (including
                        any documents, data, specifications, software, content
                        or technology) provided by or on behalf of you,
                        including Cydoc's compliance with any specifications or
                        directions provided by or on behalf of you; (c)
                        allegation of facts that, if true, would constitute your
                        breach of any of your representations, warranties,
                        covenants or obligations under this Agreement; or (d)
                        negligence or more culpable act or omission (including
                        recklessness or willful misconduct) by you or any third
                        party on behalf of you, in connection with this
                        Agreement.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li
                        id='limitationsofliability'
                        style={stylingObject.heading_1}
                    >
                        <u>Limitations of Liability</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span>
                        <strong>Limitations of Liability</strong>.&emsp;IN NO
                        EVENT WILL CYDOC OR ANY OF ITS LICENSORS, SERVICE
                        PROVIDERS OR SUPPLIERS BE LIABLE UNDER OR IN CONNECTION
                        WITH THIS AGREEMENT OR ITS SUBJECT MATTER UNDER ANY
                        LEGAL OR EQUITABLE THEORY, INCLUDING BREACH OF CONTRACT,
                        TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY AND
                        OTHERWISE, FOR ANY: (A) LOSS OF PRODUCTION, USE,
                        BUSINESS, REVENUE OR PROFIT OR DIMINUTION IN VALUE; (B)
                        IMPAIRMENT, INABILITY TO USE OR LOSS, INTERRUPTION OR
                        DELAY OF THE SERVICE; (C) LOSS, DAMAGE, CORRUPTION OR
                        RECOVERY OF DATA OR BREACH OF DATA OR SYSTEM SECURITY;
                        (D) COST OF REPLACEMENT GOODS OR SERVICE; (E) LOSS OF
                        GOODWILL OR REPUTATION; OR (F) CONSEQUENTIAL,
                        INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, ENHANCED OR
                        PUNITIVE DAMAGES, REGARDLESS OF WHETHER SUCH PERSONS
                        WERE ADVISED OF THE POSSIBILITY OF SUCH LOSSES OR
                        DAMAGES OR SUCH LOSSES OR DAMAGES WERE OTHERWISE
                        FORESEEABLE. IN NO EVENT WILL THE COLLECTIVE AGGREGATE
                        LIABILITY OF CYDOC AND ITS LICENSORS, SERVICE PROVIDERS
                        AND SUPPLIERS ARISING OUT OF OR RELATED TO THIS
                        AGREEMENT, WHETHER ARISING UNDER OR RELATED TO BREACH OF
                        CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY
                        OR ANY OTHER LEGAL OR EQUITABLE THEORY, EXCEED THE TOTAL
                        AMOUNTS PAID BY YOU TO CYDOC UNDER THIS AGREEMENT IN THE
                        THREE (3) MONTH PERIOD PRECEDING THE EVENT GIVING RISE
                        TO THE CLAIM. THE FOREGOING LIMITATIONS APPLY EVEN IF
                        ANY REMEDY FAILS OF ITS ESSENTIAL PURPOSE.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='termandtermination' style={stylingObject.heading_1}>
                        <u>Term and Termination</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='11.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            11.1 <u>Term and Termination</u>.&emsp;The term of
                            this Agreement shall be as set forth on the
                            applicable form accompanying your order, if any
                            (Order Form) or other agreement that incorporates
                            this Agreement, unless terminated as permitted
                            herein. In addition to any other express termination
                            right set forth herein or on an applicable Order
                            Form: Cydoc may terminate this Agreement immediately
                            and without liability or notice to Customer if
                            Customer: (i) fails to pay any amount when due or
                            (ii) breaches any of its obligations under
                            <a
                                href='#userestrictions'
                                style={stylingObject.link}
                            >
                                {' '}
                                Section 3
                            </a>{' '}
                            or{' '}
                            <a href='#5.1' style={stylingObject.link}>
                                Section 5.1
                            </a>
                            ; or (iii) if Cydoc files a petition of any type as
                            to its bankruptcy, is declared bankrupt, becomes
                            insolvent, makes an assignment for the benefit of
                            creditors, or goes into liquidation or receivership.
                            Regardless of the reason for such termination,
                            Customer shall pay for all of the Cydoc Service
                            provided to it prior to the termination date.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='11.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            11.2 &emsp;Notwithstanding anything contained in
                            this Agreement, Cydoc reserves the right, without
                            notice and in our sole discretion, to terminate your
                            right to access or use the Cydoc Services at any
                            time and for any or no reason, and you acknowledge
                            and agree that we shall have no liability or
                            obligation to you in such event and that you will
                            not be entitled to a refund of any amounts that you
                            have already paid to us, to the fullest extent
                            permitted by applicable law.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='11.3' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            11.3 <u>Effect of Termination</u>.&emsp;Upon
                            termination or expiration of this Agreement, you
                            shall immediately discontinue access and use of the
                            Cydoc Service and destroy all usernames and
                            passwords associated with such access.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='survivingterms' style={stylingObject.heading_1}>
                        <u>Surviving Terms</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            <strong>Surviving Terms</strong>.&emsp;The
                            provisions set forth in the following sections, and
                            any other right or obligation of the parties in this
                            Agreement that, by its nature, should survive
                            termination or expiration of this Agreement, will
                            survive any expiration or termination of this
                            Agreement:{' '}
                            <a
                                href='#userestrictions'
                                style={stylingObject.link}
                            >
                                Sections 3
                            </a>
                            , and{' '}
                            <a
                                href='#intellectualproperty'
                                style={stylingObject.link}
                            >
                                7
                            </a>
                            -
                            <a href='misc' style={stylingObject.link}>
                                13
                            </a>
                            .
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <li id='misc' style={stylingObject.heading_1}>
                        <u>Miscellaneous</u>
                    </li>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.1' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.1 <u>Relationship of the Parties</u>.&emsp;This
                            Agreement does not create any agency, partnership,
                            joint venture or other form of joint enterprise,
                            employment or fiduciary relationship between the
                            parties, and neither party shall have authority to
                            contract for or bind the other party.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.2' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.2 <u>Notices</u>.&emsp;You agree that all
                            agreements, notices, disclosures, and other
                            communications that we provide to you electronically
                            to the email address provided when you accept this
                            Agreement satisfy any legal requirement that such
                            communications be in writing. All notices, requests,
                            consents, claims, demands, waivers and other
                            communications from you to Cydoc under this
                            Agreement have binding legal effect only if in
                            writing and addressed to Cydoc as follows:
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <div style={{ marginLeft: '30%' }}>
                        <div style={stylingObject.body_text}>
                            Email Address:{' '}
                            <a
                                href='mailto: admin@cydoc.ai'
                                style={stylingObject.link}
                            >
                                admin@cydoc.ai
                            </a>
                            <br />
                            Attention: &emsp; &emsp; Dr. Rachel Draelos <br />
                            Title: &emsp;&emsp; &emsp;&emsp; CEO & Founder
                        </div>
                    </div>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span style={stylingObject.body_text}>
                        Notices sent to Cydoc in accordance with this Section
                        13.2 will be deemed effectively given: (i) when
                        received, if delivered by hand, with signed confirmation
                        of receipt; (ii) when received, if sent by a nationally
                        recognized overnight courier, signature required; (iii)
                        when sent, if by e-mail, in each case, with confirmation
                        of transmission, if sent during the addressee's normal
                        business hours, and on the next business day, if sent
                        after the addressee's normal business hours; and (iv) on
                        the third day after the date mailed by certified or
                        registered mail, return receipt requested, postage
                        prepaid.
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.3' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.3 <u>Headings</u>.&emsp;The headings in this
                            Agreement are for reference only and do not affect
                            the interpretation of this Agreement.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.4' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.4 <u>Entire Agreement</u>.&emsp;This Agreement,
                            together with the applicable Order Form, constitutes
                            the sole and entire agreement of the parties with
                            respect to the subject matter of this Agreement and
                            supersedes all prior and contemporaneous
                            understandings, agreements, representations and
                            warranties, both written and oral, with respect to
                            such subject matter.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.5' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.5 <u>Assignment</u>.&emsp;You shall not assign or
                            otherwise transfer any of its rights, or delegate or
                            otherwise transfer any of your obligations or
                            performance under this Agreement, in each case
                            whether voluntarily, involuntarily, by operation of
                            law or otherwise, without Cydoc’s prior written
                            consent. No assignment, delegation or transfer will
                            relieve you of any of your obligations or
                            performance under this Agreement. Any purported
                            assignment, delegation or transfer in violation of
                            this Section 13.5 is void. This Agreement is binding
                            upon and inures to the benefit of the parties hereto
                            and their respective successors and permitted
                            assigns.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.6' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.6 <u>No Third-Party Beneficiaries</u>.&emsp;This
                            Agreement is for the sole benefit of the parties
                            hereto and their respective successors and permitted
                            assigns and nothing herein, express or implied, is
                            intended to or shall confer upon any other person or
                            entity any legal or equitable right, benefit or
                            remedy of any nature whatsoever under or by reason
                            of this Agreement.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.7' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.7 <u>Amendment and Modification Waiver</u>
                            .&emsp;No amendment to or modification of this
                            Agreement is effective unless it is in writing and
                            signed by each party. No waiver by any party of any
                            of the provisions hereof shall be effective unless
                            explicitly set forth in writing and signed by the
                            party so waiving. Except as otherwise set forth in
                            this Agreement, no failure to exercise or delay in
                            exercising, any rights, remedy, power or privilege
                            arising from this Agreement will operate or be
                            construed as a waiver thereof; nor shall any single
                            or partial exercise of any right, remedy, power or
                            privilege hereunder preclude any other or further
                            exercise thereof or the exercise of any other right,
                            remedy, power or privilege.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.8' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.8 <u>Severability</u>.&emsp;If any term or
                            provision of this Agreement is invalid, illegal or
                            unenforceable in any jurisdiction, such invalidity,
                            illegality or unenforceability shall not affect any
                            other term or provision of this Agreement or
                            invalidate or render unenforceable such term or
                            provision in any other jurisdiction. Upon such
                            determination that any term or other provision is
                            invalid, illegal or unenforceable, the parties
                            hereto shall negotiate in good faith to modify this
                            Agreement so as to effect the original intent of the
                            parties as closely as possible in a mutually
                            acceptable manner in order that the transactions
                            contemplated hereby be consummated as originally
                            contemplated to the greatest extent possible.
                        </span>
                    </span>
                    <span>
                        <br />
                        <br />
                    </span>
                    <span id='13.9' style={{ marginLeft: '20px' }}>
                        <span style={stylingObject.body_text}>
                            13.9 <u>Governing Law; Submission to Jursdiction</u>
                            .&emsp;This Agreement is governed by and construed
                            in accordance with the internal laws of the State of
                            North Carolina, including its statutes of
                            limitations, without giving effect to any choice or
                            conflict of law provision or rule that would require
                            or permit the application of the laws of any
                            jurisdiction other than those of the State of North
                            Carolina. Any legal suit, action or proceeding
                            arising out of or related to this Agreement or the
                            licenses granted hereunder will be instituted
                            exclusively in the federal courts of the United
                            States or the courts of the State of North Carolina
                            in each case located in the city of Durham and
                            County of Durham, North Carolina, and each party
                            irrevocably submits to the exclusive jurisdiction of
                            such courts in any such suit, action or proceeding.
                            Service of process, summons, notice or other
                            document by mail to Cydoc's email address set forth
                            herein or to the email address you provide when you
                            register for the Cydoc Service shall be effective
                            service of process for any suit, action or other
                            proceeding brought in any such court.
                        </span>
                    </span>
                </ol>
                <span
                    style={{ color: 'rgb(127, 127, 127)', marginLeft: '3em' }}
                >
                    <strong>Last updated: January 10, 2022</strong>
                </span>
            </div>
        </div>
    );
};
{
    /* eslint-enable */
}
export default Terms_and_conditions;
