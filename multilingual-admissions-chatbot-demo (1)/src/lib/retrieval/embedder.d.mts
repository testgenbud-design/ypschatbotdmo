export declare const DIM: number;
export declare const SYNONYMS: Record<string, string[]>;
export declare function tokenize(text: string): string[];
export declare function expandTokens(tokens: string[]): string[];
export declare function embed(text: string, opts?: { expand?: boolean }): number[];
