import { useMutation, useQuery } from '@tanstack/react-query'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { httpClient } from '../services/httpClient'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from 'expo-router'

type User = { 
  email: string
  name: string
  id: string
  calories: string
  proteins: string
  carbohydrates: string
  fats: string
}

type SignInParams = {
  email: string
  password: string
}

type SignUpParams = {
  goal: string
  gender: string
  birthDate: string
  activityLevel: number
  height: number
  weight: number
  account: {
    name: string
    email: string
    password: string
  }
}

interface AuthContextProps {
  isLoggedIn: boolean
  isLoading: boolean
  user: User | null
  signIn(params: SignInParams): Promise<void> 
  signUp(params: SignUpParams): Promise<void> 
  signOut(): Promise<void> 
}

export const AuthContext = createContext({} as AuthContextProps)
const TOKEN_STORAGE_KEY = "@foodiary::token"

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      setToken(data)
      setIsLoadingToken(false)
    }
    load()
  }, [])

  useEffect(() => {
    async function run() {
      if (!token) {
        httpClient.defaults.headers.common["Authorization"] = null
        return
      }
      httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token)
    }
    run()
  }, [token])

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (params: SignInParams) => {
      const { data } = await httpClient.post("/signin", params)
      setToken(data.accessToken)
    }
  })

  const { mutateAsync: signUp } = useMutation({
    mutationFn: async (params: SignUpParams) => {
      const { data } = await httpClient.post("/signup", params)
      setToken(data.accessToken)
    }
  })

  const { data: user, isFetching } = useQuery({
    enabled: !!token, 
    queryKey: ["user"],
    queryFn: async () => {
        const { data } = await httpClient.get<{ user: User }>("/me")
        const { user } = data 
        return user 
    }
  })

  const signOut = useCallback(async () => {
    setToken(null)
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY)
  }, [])

  return(
    <AuthContext.Provider value={{ 
      user: user ?? null,
      isLoggedIn: !!user && !!token, 
      isLoading: isLoadingToken || isFetching, 
      signIn, 
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )

}
