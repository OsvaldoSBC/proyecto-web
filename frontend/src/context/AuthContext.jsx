import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    // FUNCIÓN DE LOGIN
    let loginUser = async (e) => {
        e.preventDefault()
        // Hacemos la petición al backend
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            // Guardamos el token
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/') // Redirigir al Home
        }else{
            alert('Usuario o contraseña incorrectos')
        }
    }

    // FUNCIÓN DE LOGOUT
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    // CONTEXTO QUE COMPARTIREMOS A TODA LA APP
    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(()=> {
        if(loading){
            setLoading(false)
        }
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}