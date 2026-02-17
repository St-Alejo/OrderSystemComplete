"use client"

import { SWRConfig } from "swr"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(`${API_BASE}${url}`, {
            headers: { "Content-Type": "application/json" },
          }).then((res) => {
            if (!res.ok) throw new Error("Error fetching data")
            return res.json()
          }),
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
