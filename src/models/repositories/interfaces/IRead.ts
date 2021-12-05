export interface IRead<T> {
  // <T> generics, es decir, puede ser cualquier tipo de mensaje.
  find(item?: T): Promise<T[]>;
  findById(id: string): Promise<T>;
}
