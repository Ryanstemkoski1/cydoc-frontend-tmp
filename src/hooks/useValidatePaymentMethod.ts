import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useField, useFormikContext } from 'formik';
import { stringFromError } from 'modules/error-utils';
import { log } from 'modules/logging';
import { SignUpFormData } from 'pages/Account/SignUpForm';

export function useValidatePaymentMethod() {
    const elements = useElements();
    const stripe = useStripe();
    const [{ value: firstName }] =
        useField<SignUpFormData['firstName']>('firstName');
    const [{ value: lastName }] =
        useField<SignUpFormData['lastName']>('lastName');
    const [, , paymentMethodHelpers] =
        useField<SignUpFormData['paymentMethod']>('paymentMethod');
    const { setSubmitting } = useFormikContext();

    const createStripePaymentMethod = async () => {
        if (elements && stripe) {
            setSubmitting(true);
            try {
                const card = elements.getElement(CardElement);
                if (card == null) {
                    return;
                }
                const { error, paymentMethod } =
                    await stripe.createPaymentMethod({
                        type: 'card',
                        card,
                        billing_details: {
                            name: `${firstName} ${lastName}`,
                        },
                    });

                if (error) {
                    log(
                        `[createPaymentMethod] error ${stringFromError(error)}`,
                        error
                    );
                    paymentMethodHelpers.setError(stringFromError(error));
                }
                if (paymentMethod?.id) {
                    // payment setup success, return true to calling function so user can advance
                    paymentMethodHelpers.setValue(paymentMethod);
                    return true;
                }
            } catch (e) {
                log(`[createStripePaymentMethod] ${stringFromError(e)}`, {
                    e,
                });
                paymentMethodHelpers.setError(
                    `Try refreshing 
                    Stripe error encountered: ${stringFromError(e)}`
                );
            } finally {
                setSubmitting(false);
            }
        } else {
            log(`User attempting payment before stripe is loaded`, {
                elements: typeof elements,
                stripe: typeof stripe,
            });
        }
        return false;
    };

    // the issue is that "loading" is updated here but not propagated to child components: review comps!
    // there is a good chance we'll need to put something like this into context
    // we should combine it with the stripe context in a stripe context wrapper
    // that includes wether or not we are currently processing a payment with stripe

    return { createStripePaymentMethod };
}
