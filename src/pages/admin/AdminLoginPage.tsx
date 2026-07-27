import { FirebaseError } from "firebase/app";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Location } from "react-router";

import dotsLogo from "../../assets/images/dots-logo.png";
import useAdminAuth from "../../hooks/useAdminAuth";

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

interface AdminLoginLocationState {
  from?: Location;
}

const authErrorMessages: Record<string, string> = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "The email address or password is incorrect.",
  "auth/user-disabled": "This Admin account has been disabled.",
  "auth/too-many-requests":
    "Too many attempts. Please wait before trying again.",
  "auth/network-request-failed":
    "Network error. Check your internet connection.",
  "admin/profile-not-found":
    "This account does not have an Admin profile.",
  "admin/not-authorized":
    "This account is not authorized to access the Admin Portal.",
  "admin/account-inactive": "This Admin account is currently inactive.",
  "admin/email-required": "Enter your Admin email address first.",
};

function getErrorCode(error: unknown): string | undefined {
  if (error instanceof FirebaseError) {
    return error.code;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

function getReadableAuthError(error: unknown): string {
  const code = getErrorCode(error);
  return (
    (code ? authErrorMessages[code] : undefined) ||
    "Unable to complete the request. Please try again."
  );
}

function validateLoginForm(
  email: string,
  password: string,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, sendAdminPasswordReset } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [requestError, setRequestError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setRequestError("");
    setSuccessMessage("");

    const validationErrors = validateLoginForm(email, password);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      await loginAdmin({ email, password, rememberMe });

      const state = location.state as AdminLoginLocationState | null;
      navigate(state?.from?.pathname || "/admin/dashboard", {
        replace: true,
      });
    } catch (error: unknown) {
      console.error("Admin login failed:", error);
      setRequestError(getReadableAuthError(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(): Promise<void> {
    setRequestError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        email: "Enter your Admin email address first.",
      }));
      return;
    }

    try {
      setResettingPassword(true);
      await sendAdminPasswordReset(email);
      setSuccessMessage(
        "Password reset instructions have been sent to the Admin email.",
      );
    } catch (error: unknown) {
      console.error("Password reset request failed:", error);
      setRequestError(getReadableAuthError(error));
    } finally {
      setResettingPassword(false);
    }
  }

  function updateEmail(value: string): void {
    setEmail(value);
    setRequestError("");
    setSuccessMessage("");

    if (fieldErrors.email) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        email: undefined,
      }));
    }
  }

  function updatePassword(value: string): void {
    setPassword(value);
    setRequestError("");

    if (fieldErrors.password) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        password: undefined,
      }));
    }
  }

  const displayedError =
    requestError || fieldErrors.password || fieldErrors.email;

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#fbfbfa] px-6 py-12 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 -top-52 h-[700px] w-[700px] rounded-full bg-[#f4f5f7]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-80 -right-72 h-[700px] w-[700px] rounded-full bg-[#f4f5f7]"
      />

      <div className="relative z-10 m-auto w-full max-w-[430px]">
        <section className="rounded-2xl border border-[#d9dce2] bg-white px-6 py-9 shadow-[0_20px_50px_rgba(15,23,42,0.10)] sm:px-11 sm:py-10">
          <header className="text-center">
            <img
              src={dotsLogo}
              alt="DOTS"
              className="mx-auto h-[112px] w-[112px] object-contain sm:h-[120px] sm:w-[120px]"
            />
            <p className="mt-1 text-[27px] font-bold tracking-[0.02em] text-[#0b2557]">
              DOTS
            </p>
            <h1 className="mt-2 text-[29px] font-bold leading-tight text-[#252a37] sm:text-[32px]">
              Admin Portal
            </h1>
            <p className="mt-2 text-[15px] tracking-[0.02em] text-[#68707e]">
              Sign in to manage website content
            </p>
          </header>

          <form className="mt-7" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-[15px] font-bold text-[#2d313b]"
              >
                Email Address
              </label>
              <div
                className={`flex h-14 items-center rounded-lg border bg-white px-3 transition focus-within:border-[#0d1830] focus-within:ring-2 focus-within:ring-[#0d1830]/10 ${
                  fieldErrors.email ? "border-red-400" : "border-[#d7dae0]"
                }`}
              >
                <Mail
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-[#77808d]"
                  strokeWidth={1.7}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    updateEmail(event.target.value)
                  }
                  autoComplete="email"
                  placeholder="admin@dots.com"
                  disabled={submitting}
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-slate-900 outline-none placeholder:text-[#818996]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="admin-password"
                className="mb-2 block text-[15px] font-bold text-[#2d313b]"
              >
                Password
              </label>
              <div
                className={`flex h-14 items-center rounded-lg border bg-white px-3 transition focus-within:border-[#0d1830] focus-within:ring-2 focus-within:ring-[#0d1830]/10 ${
                  fieldErrors.password ? "border-red-400" : "border-[#d7dae0]"
                }`}
              >
                <LockKeyhole
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-[#77808d]"
                  strokeWidth={1.7}
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    updatePassword(event.target.value)
                  }
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  disabled={submitting}
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-slate-900 outline-none placeholder:text-[#818996]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="rounded-md p-1 text-[#77808d] transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" strokeWidth={1.7} />
                  ) : (
                    <Eye className="h-6 w-6" strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </div>

            <div aria-live="polite" className="min-h-7 pt-2">
              {displayedError && (
                <p className="text-[13px] text-red-500">{displayedError}</p>
              )}
              {!displayedError && successMessage && (
                <p className="text-[13px] text-emerald-700">
                  {successMessage}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#303541]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setRememberMe(event.target.checked)
                  }
                  disabled={submitting}
                  className="h-[18px] w-[18px] cursor-pointer rounded border-[#cfd3da] accent-[#10192e]"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => void handleForgotPassword()}
                disabled={submitting || resettingPassword}
                className="text-right text-[14px] font-bold text-[#102348] transition hover:text-[#243c6c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resettingPassword ? "Sending..." : "Forgot Password?"}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || resettingPassword}
              className="mt-7 flex h-[57px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#10182d] px-6 text-[17px] font-bold text-white transition hover:bg-[#1c2946] focus:outline-none focus:ring-4 focus:ring-[#10182d]/20 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {submitting && (
                <LoaderCircle
                  className="h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
              )}
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </section>

        <p className="mt-7 text-center text-[13px] text-[#68707e]">
          © 2025 DOTS. Admin access only.
        </p>
      </div>
    </main>
  );
}

export default AdminLoginPage;
