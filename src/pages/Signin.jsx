import { addToast, Alert, Button, Input } from '@heroui/react'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeFilledIcon } from '../components/passwords/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/passwords/EyeSlashFilledIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from "../Validation/loginschema";
import axios from 'axios';
import { authContext } from '../contexts/Authcontext';

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const navigate = useNavigate();
  const { setUserToken } = useContext(authContext)
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "rroro12@gmail.com",
      password: "1234567@RHSrawan",
    }
  })

  async function signIn(loginData) {
    setIsLoading(true)
    setErrMsg("")
    try {
      const { data } = await axios.post("https://route-posts.routemisr.com/users/signin", loginData)
      localStorage.token = data.data.token;
      setUserToken(data.data.token)
      addToast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        color: "success"
      })
      navigate('/')
    } catch (error) {
      if (error.response) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg(error.message);
      }
    } finally {
      setIsLoading(false)
    }
  }

  function getInputProps(label, type, field) {
    return {
      label,
      type,
      isInvalid: !!field,
      errorMessage: field?.message
    }
  }


  return (
    <>
      <div className="w-full max-w-md mx-auto relative z-10 mb-8 mt-4">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/Signup" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="w-full max-w-[440px] mx-auto relative z-10">
        <div className="bg-white dark:bg-[#1e1e1e] py-10 px-6 sm:px-10 shadow-2xl dark:shadow-black/50 sm:rounded-3xl border border-gray-100 dark:border-gray-800">

          <form className="space-y-6" onSubmit={handleSubmit(signIn)}>

            <Input
              variant="flat"
              radius="lg"
              labelPlacement="outside"
              placeholder="Enter your email"
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
                label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
              }}
              {...register("email")}
              {...getInputProps("Email Address", "email", errors.email)}
            />

            <Input
              variant="flat"
              radius="lg"
              labelPlacement="outside"
              placeholder="Enter your password"
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
                label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
              }}
              {...register("password")}
              {...getInputProps("Password", isVisible ? "text" : "password", errors.password)}
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-xl text-gray-500" />
                  ) : (
                    <EyeFilledIcon className="text-xl text-gray-500" />
                  )}
                </button>
              }
            />

            
            

            {errMsg && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errMsg}</p>
              </div>
            )}

            <div>
              <Button
                isLoading={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-md py-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                Sign In
              </Button>
            </div>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                Facebook
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  )
}
