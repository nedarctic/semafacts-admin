import { LoginForm } from "@/components/login-form"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the admin workspace and manage incidents securely.
          </p>
        </div>
        <LoginForm userType="Admin" />
      </div>
    </div>
  )
}
