export interface IpasswordService {
  hashPassword(password: string): Promise<string>;
  comparePassword: (hash: string, password: string) => Promise<boolean>;
}
