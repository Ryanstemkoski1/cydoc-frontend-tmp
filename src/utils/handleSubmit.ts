import { AxiosInstance } from 'axios';

export function handleSubmit(
    apiClient: AxiosInstance,
    path: string,
    payloadToSend: object,
    onSuccess: any,
    onError: any
) {
    apiClient
        .post(path, { ...payloadToSend })
        .then((res) => {
            if (res.status !== 200) throw new Error();
            onSuccess();
        })
        .catch((_error) => {
            onError();
        });
}
