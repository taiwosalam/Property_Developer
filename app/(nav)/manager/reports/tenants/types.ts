
export interface FilterResult {
    options: string[];
    menuOptions: { [key: string]: string[] };
    startDate: string | null;
    endDate: string | null;
}

export type BranchFilter = {
    id: number;
    branch_name: string;
}

export type PropertyFilter = {
    id: number;
    title: string
}