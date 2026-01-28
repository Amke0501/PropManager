"use client"
import { useState } from "react"

export default function Login() {
   const [email, setEmail] = useState("")
  const [password, setPassword] = useState("") 

    const [rememberMe, setRememberMe] = useState(false)
   const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

       if (!email || !password) {
       setError("Please fill in all fields")
      return 
    }

      if (!email.includes("@")) {
       setError("Please enter a valid email")
       return
    }

    setLoading(true)

   
      setTimeout(() => {
      console.log("Login details:", {
        email,
        password,
        rememberMe,
      })

        setLoading(false)
       alert("Login successful (frontend only)")
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and password
        </p>

              <form onSubmit={handleSubmit}>
            {error && (
             <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

 <div className="mb-4">
         <label className="block text-sm mb-1">
          Email
        </label>
            <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full border px-3 py-2 rounded"
            />
          </div>

  <div className="mb-4">
            <label className="block text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

    <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Remember me</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span className="text-blue-600 underline cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
