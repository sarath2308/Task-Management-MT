import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useResendOtp } from "../hook/auth/resend.otp.hook";
import { useVerifyOtpAndSignup } from "../hook/auth/verify.otp.hook";

const OTPInput: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const tempToken = searchParams.get("tempToken");

  const navigate = useNavigate();

  const resendOtpMutation = useResendOtp();
  const verifyMutation = useVerifyOtpAndSignup();


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------ Autofocus ------------------ */

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ------------------ Input Change ------------------ */

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);

    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ------------------ Backspace Navigation ------------------ */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ------------------ Paste OTP ------------------ */

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d{6}$/.test(data)) {
      const digits = data.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  /* ------------------ Submit ------------------ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    const finalOtp = otp.join("");

    if (!/^\d{6}$/.test(finalOtp)) return;

    try {
      await verifyMutation.mutateAsync({
        email,
        otp: finalOtp,
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ Resend OTP ------------------ */

  const handleResend = async () => {
    if (!canResend || !email || !tempToken) return;

    try {
      await resendOtpMutation.mutateAsync({
        email,
        tempToken,
      });

      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      verifyMutation.reset();

      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 border border-gray-800">

        {/* Back */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Verify your email
          </h2>

          <p className="text-gray-400 text-sm">
            We sent a code to{" "}
            <span className="text-blue-400 font-medium">
              {email ?? "your email"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some((v) => v === "") || verifyMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifyMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Verify & Create Account"
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-800 pt-8">

          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold mx-auto"
            >
              {resendOtpMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Resend New Code
            </button>
          ) : (
            <div className="text-gray-500 font-mono text-sm">
              Resend in 00:{timer < 10 ? `0${timer}` : timer}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OTPInput;