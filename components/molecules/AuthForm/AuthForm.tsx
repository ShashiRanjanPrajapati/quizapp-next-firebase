"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = authSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

type AuthFormProps =
  | {
      mode: "login";
      onSubmit: (data: AuthFormData) => Promise<void>;
      loading?: boolean;
    }
  | {
      mode: "register";
      onSubmit: (data: RegisterFormData) => Promise<void>;
      loading?: boolean;
    };

function LoginForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" loading={loading}>
        Sign In
      </Button>
    </form>
  );
}

function RegisterForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Display Name"
        placeholder="John Doe"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" loading={loading}>
        Create Account
      </Button>
    </form>
  );
}

export function AuthForm(props: AuthFormProps) {
  const { loading = false } = props;

  if (props.mode === "register") {
    return <RegisterForm onSubmit={props.onSubmit} loading={loading} />;
  }

  return <LoginForm onSubmit={props.onSubmit} loading={loading} />;
}
