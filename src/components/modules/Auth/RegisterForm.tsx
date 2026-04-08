"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { registerZodSchema } from "@/zod/auth.validation";
import { env } from "@/config/env";
import { ImageUploadField } from "@/components/shared/form/image-upload-field";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface RegisterFormProps {
    redirectPath?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delayChildren: 0.1, staggerChildren: 0.1, ease: "easeOut" }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {

    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            image: "",
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating account...");

            setServerError(null);
            try {
                const { data, error } = await authClient.signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    image: value.image || undefined,
                    phone: value.phone,
                });

                if (error) {
                    toast.error(error.message, { id: toastId });
                    setServerError(error.message || "Registration failed");
                    return;
                }
                toast.success("Account created successfully!", { id: toastId });
                router.push(redirectPath || "/");

            } catch (error: any) {
                toast.error("Something went wrong, please try again.", { id: toastId });
                setServerError(`Registration failed: ${error.message}`);
            }
        }
    });

    return (
        <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full max-w-md mx-auto my-10">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-orange-400/20 via-transparent to-transparent blur-3xl pointer-events-none" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full relative z-10"
            >
                <Card className="shadow-2xl border-white/20 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-black/60 backdrop-blur-2xl rounded-[2rem]">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5 pointer-events-none" />

                    <CardHeader className="text-center pt-10 pb-4 relative z-10">
                        <motion.div variants={itemVariants} className="flex flex-col items-center">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-14 w-14 mb-4 select-none relative group"
                            >
                                <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                <img
                                    src="/assets/urban_snaks_logo.png"
                                    alt="Urban Snacks Logo"
                                    className="relative z-10 h-full w-full object-contain drop-shadow-md"
                                />
                            </motion.div>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                Join <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Urban Snacks</span>
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Create an account to start ordering quickly
                            </p>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="px-6 sm:px-10 relative z-10 pb-8">
                        <form
                            method="POST"
                            action="#"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-5"
                        >
                            <motion.div variants={itemVariants}>
                                <form.Field name="image" validators={{ onChange: registerZodSchema.shape.image }}>
                                    {(field) => (
                                        <ImageUploadField
                                            field={field}
                                            label="Profile Image (Optional)"
                                        />
                                    )}
                                </form.Field>
                            </motion.div>
                            
                            <motion.div variants={itemVariants}>
                                <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                                    {(field) => (
                                        <AppField field={field} label="Full Name" placeholder="John Doe" />
                                    )}
                                </form.Field>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
                                    {(field) => (
                                        <AppField field={field} label="Email Address" type="email" placeholder="hello@example.com" />
                                    )}
                                </form.Field>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <form.Field name="phone" validators={{ onChange: registerZodSchema.shape.phone }}>
                                    {(field) => (
                                        <AppField field={field} label="Phone Number (Optional)" type="number" placeholder="01627142598" />
                                    )}
                                </form.Field>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="cursor-pointer"
                                            append={
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowPassword((value) => !value)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                </Button>
                                            }
                                        />
                                    )}
                                </form.Field>
                            </motion.div>

                            <AnimatePresence>
                                {serverError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                    >
                                        <Alert variant="destructive" className="mt-2 border-red-500/50 bg-red-50/50 dark:bg-red-500/10">
                                            <AlertDescription>{serverError}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div variants={itemVariants} className="pt-2">
                                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                    {([canSubmit, isSubmitting]) => (
                                        <AppSubmitButton
                                            isPending={isSubmitting}
                                            pendingLabel="Creating Account..."
                                            disabled={!canSubmit}
                                            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold text-md"
                                        >
                                            Sign Up
                                        </AppSubmitButton>
                                    )}
                                </form.Subscribe>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="mt-8">
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    or continue with
                                </span>
                                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                            </div>
                            
                            <Button
                                variant="outline"
                                className="w-full mt-6 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors font-medium text-slate-700 dark:text-slate-300 hover:shadow-sm"
                                onClick={async () => {
                                    await authClient.signIn.social({
                                        provider: "google",
                                        callbackURL: env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL || redirectPath || "/"
                                    });
                                }}
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                        </motion.div>
                    </CardContent>

                    <CardFooter className="justify-center pt-2 pb-8 relative z-10">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default RegisterForm;
