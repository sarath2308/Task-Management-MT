import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginInput } from '../schemas/auth.schemas'
import { useLogin } from '../hook/auth/login.hook';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSwitch: () => void;
}

const Login: React.FC<Props> = ({ onSwitch }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
 const loginMutation = useLogin();
  const onSubmit = async(data: LoginInput) => {
    try{
    await loginMutation.mutateAsync(data);
    navigate("/home");
    }catch(err){
        console.error(err)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              {...register("email")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition duration-200 mt-4"
          >
            {isSubmitting ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-emerald-400 hover:underline font-medium">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;