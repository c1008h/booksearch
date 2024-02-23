export interface BookProp {
    title: string;
    authors: string[];
    first_publish_year: number;
    isbn: string[];
    number_of_pages: number;
}

export interface SearchResultProp {
    docs: BookProp[];
}