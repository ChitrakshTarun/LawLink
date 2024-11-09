export interface PromptInterface {
  name: string;
  age: number;
  email: string;
  state: string;
  criminalHistory: string | undefined;
  summary?: string;
  description: string;
}
