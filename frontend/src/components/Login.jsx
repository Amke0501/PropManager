import { useState } from "react"
import {Link} from "react-router-dom"

export function Login() {
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
try {
  // Step 1: Send email & password to backend
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  // Step 2: Get the response from backend
  const data = await response.json();

  // Step 3: If login worked, save the token
  if (data.success) {
    // Save auth token so other pages can use it
    localStorage.setItem('authToken', data.session.access_token);
    // Save user info (name, role, etc.)
    localStorage.setItem('user', JSON.stringify(data.user));

    setLoading(false);
    alert('Login successful!');
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    // If login failed, show error message
    setError(data.message || 'Login failed');
    setLoading(false);
  }
} catch (error) {
  // If server is down or network error
  setError('Unable to connect to server');
  setLoading(false);
}
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

      <Link to="/signup">
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span className="text-blue-600 underline cursor-pointer">
            Sign up
          </span>
        </p>
        </Link>
      </div>
    </div>
  )
}
