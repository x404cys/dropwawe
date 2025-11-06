// types/paylib.d.ts
interface PaylibResponse {
  payment_token?: string;
  error?: boolean;
  message?: string;
}

interface Paylib {
  inlineForm(options: {
    key: string;
    form: HTMLFormElement;
    autoSubmit: boolean;
    callback: (response: PaylibResponse) => void;
  }): void;
  handleError(element: HTMLElement, response: PaylibResponse): void;
}

declare global {
  interface Window {
    paylib?: Paylib;
  }
}

export {};
