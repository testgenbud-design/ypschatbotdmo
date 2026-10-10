export interface Chunk {
  id: string;
  source: string;
  source_url: string;
  title: string;
  programme: string;
  heading: string;
  text: string;
  words: number;
  tokens: string[];
  tags: string[];
  vec: number[];
}
export interface ScoredChunk extends Chunk {
  score: number;
  cosine: number;
  bm25: number;
  coverage: number;
}
export declare const ANSWER_THRESHOLD: number;
export declare function retrieve(query: string, chunks: Chunk[], k?: number): ScoredChunk[];
