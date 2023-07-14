/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Customer } from '../models/Customer';
import type { CustomerList } from '../models/CustomerList';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * list customers
     * @param search search query
     * @param page search query
     * @param threads search query
     * @returns CustomerList OK
     * @throws ApiError
     */
    public listCustomers(
        search?: string,
        page?: number,
        threads?: Array<string>,
    ): CancelablePromise<CustomerList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/customers',
            query: {
                'search': search,
                'page': page,
                'threads': threads,
            },
        });
    }

    /**
     * get customer
     * @param id id
     * @returns Customer OK
     * @throws ApiError
     */
    public getCustomer(
        id: string,
    ): CancelablePromise<Customer> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/customers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `NOT FOUND`,
            },
        });
    }

}
