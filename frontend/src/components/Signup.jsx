import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function fakeRegister(email, password, role) {
  console.log("Creating account:", { email, role })

  
  return Promise.resolve({ email, role })
}

export function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("user") 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don’t match")
      return
    }

    setLoading(true)

    try {
      // BACKEND API CALL: POST to /api/auth/signup
      // This sends user data to the backend server running on port 3000
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,                              // User's email from form input
          password,                           // User's password from form input
          firstName: email.split('@')[0],    // Extract name from email (before @)
          lastName: 'User',                   // Default value (backend requires non-empty)
          role                                // "user" or "admin" from radio selection
        })
      });

      // Parse the JSON response from backend
      const data = await response.json();

      // CHECK IF SIGNUP WAS SUCCESSFUL
      if (data.success) {
        // STEP 1: Save authentication token to localStorage (if session exists)
        if (data.session?.access_token) {
          localStorage.setItem('authToken', data.session.access_token);
        }
        
        // STEP 2: Save user information to localStorage
        // Includes: id, email, role - useful for UI and authorization checks
        localStorage.setItem('user', JSON.stringify(data.user));

        // STEP 3: Show success message
        alert('Account created successfully!');
        
        // STEP 4: Redirect to appropriate dashboard based on user role
        if (data.user.role === "admin") {
          navigate("/admin")     // Admin users go to /admin route
        } else {
          navigate("/user")      // Regular users go to /user route
        }
      } else {
        // If backend returns success: false, show the error message
        setError(data.message || 'Signup failed');
      }
    } catch (e) {
      // NETWORK ERROR HANDLING
      // This catches: server down, network issues, CORS errors, etc.
      setError('Unable to connect to server. Make sure backend is running on port 3000');
    } finally {
      // Always stop loading spinner, whether success or failure
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign up to start managing your properties or view your current property
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Role selection */}
          <div>
            <p className="text-sm font-medium mb-2">Choose account type</p>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                User
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                Admin
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
