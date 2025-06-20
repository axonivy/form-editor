export type ValuesAsUnion<T> = {
  [V in keyof T]: T[V];
}[keyof T];

export type ValuesAsUnionDeep<T> = {
  [V in keyof T]: T[V] extends object ? ValuesAsUnionDeep<T[V]> : T[V];
}[keyof T];

export type KeysOfUnion<T> = T extends T ? keyof T : never;

declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = T extends Array<infer U> ? Array<DeepPartial<U>> : { [A in keyof T]?: DeepPartial<T[A]> };
