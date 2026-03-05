import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../Validation/changePasswordSchema';
import axios from 'axios';
import { authContext } from '../contexts/Authcontext';
import { addToast, Button, Input } from '@heroui/react';
import { EyeFilledIcon } from './passwords/EyeFilledIcon';
import { EyeSlashFilledIcon } from './passwords/EyeSlashFilledIcon';

export default function ChangePassword() {
    const { userToken, setUserToken } = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [isCurrentVisible, setIsCurrentVisible] = useState(false);
    const [isNewVisible, setIsNewVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            password: '',
            rePassword: ''
        }
    });

    async function onChangePasswordSubmit(data) {
        setIsLoading(true);
        setErrMsg('');
        try {
            const response = await axios.patch(
                'https://route-posts.routemisr.com/users/change-password',
                {
                    password: data.currentPassword,
                    newPassword: data.password
                },
                {
                    headers: { token: userToken }
                }
            );

            
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                setUserToken(response.data.token);
            }

            addToast({
                title: "Success",
                description: "Your password has been changed successfully.",
                color: "success"
            });

            reset(); 
        } catch (error) {
            if (error.response?.data?.message) {
                setErrMsg(error.response.data.message);
            } else if (error.response?.data?.error) {
                setErrMsg(error.response.data.error);
            } else {
                setErrMsg("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function getInputProps(label, type, field) {
        return {
            label,
            type,
            isInvalid: !!field,
            errorMessage: field?.message
        };
    }

    const inputClassNames = {
        inputWrapper: "bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors",
        label: "font-medium text-gray-700 dark:text-gray-300 mb-1"
    };

    return (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit(onChangePasswordSubmit)}>
                <Input
                    variant="flat"
                    radius="lg"
                    labelPlacement="outside"
                    placeholder="Enter current password"
                    classNames={inputClassNames}
                    {...register("currentPassword")}
                    {...getInputProps("Current Password", isCurrentVisible ? "text" : "password", errors.currentPassword)}
                    endContent={
                        <button
                            aria-label="toggle current password visibility"
                            className="focus:outline-none p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                            type="button"
                            onClick={() => setIsCurrentVisible(!isCurrentVisible)}
                        >
                            {isCurrentVisible ? <EyeSlashFilledIcon className="text-xl text-gray-500" /> : <EyeFilledIcon className="text-xl text-gray-500" />}
                        </button>
                    }
                />

                <Input
                    variant="flat"
                    radius="lg"
                    labelPlacement="outside"
                    placeholder="Enter new password"
                    classNames={inputClassNames}
                    {...register("password")}
                    {...getInputProps("New Password", isNewVisible ? "text" : "password", errors.password)}
                    endContent={
                        <button
                            aria-label="toggle new password visibility"
                            className="focus:outline-none p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                            type="button"
                            onClick={() => setIsNewVisible(!isNewVisible)}
                        >
                            {isNewVisible ? <EyeSlashFilledIcon className="text-xl text-gray-500" /> : <EyeFilledIcon className="text-xl text-gray-500" />}
                        </button>
                    }
                />

                <Input
                    variant="flat"
                    radius="lg"
                    labelPlacement="outside"
                    placeholder="Confirm new password"
                    classNames={inputClassNames}
                    {...register("rePassword")}
                    {...getInputProps("Confirm Password", isConfirmVisible ? "text" : "password", errors.rePassword)}
                    endContent={
                        <button
                            aria-label="toggle confirm password visibility"
                            className="focus:outline-none p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                            type="button"
                            onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                        >
                            {isConfirmVisible ? <EyeSlashFilledIcon className="text-xl text-gray-500" /> : <EyeFilledIcon className="text-xl text-gray-500" />}
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

                <div className="pt-2">
                    <Button
                        isLoading={isLoading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                    >
                        Update Password
                    </Button>
                </div>
            </form>
        </div>
    );
}
