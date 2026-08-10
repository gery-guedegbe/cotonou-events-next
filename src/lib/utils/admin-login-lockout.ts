const COOKIE_NAME = "cotonou_admin_login";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginLockoutState {
  attempts: number;
  blockedUntil?: number;
}

function parseCookieValue(value: string): LoginLockoutState {
  try {
    const state = JSON.parse(decodeURIComponent(value)) as LoginLockoutState;
    return {
      attempts: typeof state.attempts === "number" ? state.attempts : 0,
      blockedUntil:
        typeof state.blockedUntil === "number" ? state.blockedUntil : undefined,
    };
  } catch {
    return { attempts: 0 };
  }
}

function buildCookieValue(state: LoginLockoutState) {
  return encodeURIComponent(JSON.stringify(state));
}

function readCookie(): LoginLockoutState {
  if (typeof document === "undefined") return { attempts: 0 };
  const raw = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));

  if (!raw) return { attempts: 0 };
  return parseCookieValue(raw.split("=")[1] ?? "");
}

function writeCookie(state: LoginLockoutState) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${buildCookieValue(state)}; path=/; expires=${expires}; samesite=strict`;
}

function clearCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict`;
}

export function getLoginLockoutState() {
  const state = readCookie();
  const now = Date.now();
  const blockedUntil =
    state.blockedUntil && state.blockedUntil > now
      ? state.blockedUntil
      : undefined;
  return {
    attempts: state.attempts,
    blockedUntil,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - state.attempts),
    isBlocked: Boolean(blockedUntil),
  };
}

export function recordFailedLoginAttempt() {
  const state = readCookie();
  const nextAttempts = state.attempts + 1;
  const nextState: LoginLockoutState = {
    attempts: nextAttempts,
    blockedUntil:
      nextAttempts >= MAX_ATTEMPTS
        ? Date.now() + LOCKOUT_DURATION_MS
        : state.blockedUntil,
  };
  writeCookie(nextState);
  return getLoginLockoutState();
}

export function clearLoginLockout() {
  clearCookie();
}
