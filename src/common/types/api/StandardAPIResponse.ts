export interface StandardAPIResponse<T = unknown> {
  message: string;
  data: T | null;
}
