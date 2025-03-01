export interface BaseModel<T> {
  id: T;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
