import { AxiosInstance } from 'axios';
import { managerClient } from 'constants/api';
import { ApiEditManager, Manager } from 'types/users';

type UpdateManagerResponse = string[];

export async function createOrUpdateManager(user: ApiEditManager) {
    // initializes empty lists for associatedDoctors and joinedDoctors so that they can be appended to in future update requests
    user.associatedDoctors = [];
    user.joinedDoctors = [];

    const response = await postToApi<UpdateManagerResponse>(
        managerClient,
        '/managers',
        {
            manager: user,
        }
    );

    if (response && response.length && typeof response[0] === 'string') {
        return response[0];
    }
}

// export function createOrUpdateClinician(user: DynamoDbUser) {
//     const doctor_uuid = attributes['custom:UUID'];
//     url = doctorClient;
//     path = `/doctors/${doctor_uuid}`;
//     delete user.username;
//     payload = JSON.stringify({ doctor: user });
//     customerInfo.customer.attributes.customerUUID = doctor_uuid;
// }

async function postToApi<T>(url: AxiosInstance, path: string, payload: any) {
    const response = await url.post(path, JSON.stringify(payload));

    if (response.data?.[0]) {
        return response.data as T;
    } else {
        // log(`unexpected API response`)
    }
}
