"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "../../components/Login";

const queryClient = new QueryClient();

export default function LoginPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}
