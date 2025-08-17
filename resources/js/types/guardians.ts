interface SimpleStudent {
    id: number;
    name: string;
}

export interface Guardian {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    children?: Array<{
        id: number;
        pivot?: {
            relationship_type: string;
        };
    }>;
}