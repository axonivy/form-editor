type Consumer<T> = (accept: T) => void;
export type Unary<T> = (apply: T) => T;
export type UpdateConsumer<T> = Consumer<Unary<T>>;

export type AutoCompleteWithString<T> = T | (string & {});
