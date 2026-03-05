import { addToast, Alert, Button, Input, Select, SelectItem } from '@heroui/react'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeFilledIcon } from '../components/passwords/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/passwords/EyeSlashFilledIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from "../Validation/registerschema";
import axios from 'axios';
import { authContext } from '../contexts/Authcontext';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { setUserToken } = useContext(authContext)

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Rawan Hassan",
      email: "rawan1200@gmail.com",
      password: "1234567@RHSrawan",
      rePassword: "1234567@RHSrawan",
      dateOfBirth: "2004-10-10",
      gender: "female"
    }
  })

  async function signUp(registerData) {
    setIsLoading(true)
    setErrMsg("")
    try {
      const { data } = await axios.post("https://route-posts.routemisr.com/users/signup", registerData)
      localStorage.token = data.data.token;
      setUserToken(data.data.token)
      addToast({
        title: "Welcome on board!",
        description: "Account created successfully.",
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
          Create account
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/Signin" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="w-full max-w-[480px] mx-auto relative z-10">
        <div className="bg-white dark:bg-[#1e1e1e] py-10 px-6 sm:px-10 shadow-2xl dark:shadow-black/50 sm:rounded-3xl border border-gray-100 dark:border-gray-800">

          <form className="space-y-6" onSubmit={handleSubmit(signUp)}>

            <Input
              variant="flat"
              radius="lg"
              labelPlacement="outside"
              placeholder="Enter your full name"
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
                label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
              }}
              {...register("name")}
              {...getInputProps("Full Name", "text", errors.name)}
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                variant="flat"
                radius="lg"
                labelPlacement="outside"
                placeholder="Enter password"
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
                    {isVisible ? <EyeSlashFilledIcon className="text-xl text-gray-500" /> : <EyeFilledIcon className="text-xl text-gray-500" />}
                  </button>
                }
              />

              <Input
                variant="flat"
                radius="lg"
                labelPlacement="outside"
                placeholder="Confirm password"
                classNames={{
                  inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
                  label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
                }}
                {...register("rePassword")}
                {...getInputProps("Confirm Password", isVisible ? "text" : "password", errors.rePassword)}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? <EyeSlashFilledIcon className="text-xl text-gray-500" /> : <EyeFilledIcon className="text-xl text-gray-500" />}
                  </button>
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                variant="flat"
                radius="lg"
                labelPlacement="outside"
                classNames={{
                  inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
                  label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
                }}
                {...register("dateOfBirth")}
                {...getInputProps("Date of Birth", "date", errors.dateOfBirth)}
              />

              <Select
                variant="flat"
                radius="lg"
                labelPlacement="outside"
                placeholder="Select gender"
                classNames={{
                  trigger: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors py-1",
                  label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
                }}
                {...register("gender")}
                {...getInputProps("Gender", "text", errors.gender)}
              >
                <SelectItem key="female" value="female">Female</SelectItem>
                <SelectItem key="male" value="male">Male</SelectItem>
              </Select>
            </div>

            {errMsg && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errMsg}</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                isLoading={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-md py-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
              >
                Create Account
              </Button>
            </div>

          </form>

        </div>
      </div>
    </>
  )
}
