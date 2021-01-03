export interface IUser {
  id: string;
  name: string;
  type: string;
  send(): void;
}
export interface IUsers {
  [key: string]: IUser;
}