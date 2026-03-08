import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, type SignupInput } from "../schemas/auth.schemas";
import { useNavigate } from 'react-router-dom';
import { useRequestSignup } from '../hook/auth/req.signup.hook';

interface Props {
  onSwitch: () => void;
}

const Signup: React.FC<Props> = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });
  const navigate = useNavigate();
  const signupMutation = useRequestSignup();
  const onSubmit = async(data: SignupInput) => {
    try{
    const response = await signupMutation.mutateAsync(data);
    navigate(`/auth/verify-otp?email=${data.email}&token=${response.tempToken}`);
    }catch(err){
        console.error(err)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              {...register("name")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              {...register("email")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="name@company.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-blue-400 hover:underline font-medium">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;