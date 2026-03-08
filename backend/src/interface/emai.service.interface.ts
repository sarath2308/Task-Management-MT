export interface IEmailService {
  sendSignupOtp: (to: string, otp: string) => Promise<void>;
}
