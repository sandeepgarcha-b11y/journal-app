import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Journal — Sign in",
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const isInvalid = error === "CredentialsSignin";

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-cream-200 bg-white p-8 shadow-warm">
        {/* Brand mark */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-50 text-2xl text-center">
          📓
        </div>

        <h1 className="text-center text-xl font-semibold text-stone-900">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-stone-400">Sign in to access your journal.</p>

        {isInvalid && (
          <p className="mt-4 rounded-xl bg-terracotta-50 px-4 py-2.5 text-center text-sm text-terracotta-600">
            Incorrect username or password.
          </p>
        )}

        <form
          className="mt-6 flex flex-col gap-4"
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("credentials", {
                username: formData.get("username"),
                password: formData.get("password"),
                redirectTo: "/journal",
              });
            } catch (e) {
              if (e instanceof AuthError) {
                redirect(`/login?error=${e.type}`);
              }
              throw e;
            }
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-stone-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-warm-sm transition-all duration-150 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-warm-sm transition-all duration-150 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 active:translate-y-0"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
