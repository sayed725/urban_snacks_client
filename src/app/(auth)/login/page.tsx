"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn.email({
        email: values.email,
        password: values.password,
      });
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (e) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="container mx-auto py-24 flex justify-center">
      <div className="w-full max-w-md bg-card border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Urban Snacks</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...form.register("email")} className="w-full border rounded-md p-2 bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" {...form.register("password")} className="w-full border rounded-md p-2 bg-background" />
          </div>
          <Button type="submit" className="w-full mt-4">Login</Button>
        </form>
      </div>
    </div>
  );
}
