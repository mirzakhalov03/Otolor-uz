// Decouples the axios module from React: the interceptor emits, AuthProvider handles.
type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(fn: UnauthorizedHandler | null): void {
  handler = fn;
}

export function emitUnauthorized(): void {
  handler?.();
}
