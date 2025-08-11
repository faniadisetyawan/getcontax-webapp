import { router, usePage } from "@inertiajs/react";

export interface QueryParams {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
    [key: string]: any; // Allow other potential query params
}

export function useQueryParams(): [QueryParams, (params: QueryParams) => void] {
    const { url } = usePage();
    const currentUrl = new URL(window.location.href);
    const params = Object.fromEntries(currentUrl.searchParams);

    const updateParams = (newParams: QueryParams) => {
        router.get(url.split('?')[0], { // Use base URL to avoid duplicate query strings
            ...params,
            ...newParams
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return [params as QueryParams, updateParams];
}