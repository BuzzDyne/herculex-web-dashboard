import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/auth/refresh', {
      headers: {
        'Authorization': `Bearer ${auth?.refreshToken}`
      }
    });

    setAuth(prev=> {
      console.log(JSON.stringify(prev))
      console.log(response.data.access_token);
      return { ...prev, accessToken: response.data.access_token}
    })

    return response.data.access_token
  }

  return refresh
}

export default useRefreshToken