import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LogOutIcon } from 'lucide-react-native'
import { colors } from '../styles/colors'
import { useAuth } from '../hooks/useAuth'

export function HomeHeader() {
  const { signOut, user } = useAuth()

  return (
    <View className='bg-lime-400 h-[130px]'>
      <SafeAreaView className='px-4 flex-row items-center justify-between'>
        <View>
          <Text className='text-gray-700 text-sm font-sans-regular'>Olá, 👋</Text>
          <Text className='text-black-700 text-base font-sans-semibold'>{user?.name}!</Text>
        </View>

        <TouchableOpacity className='size-12 items-center justify-center bg' onPress={signOut}>
          <LogOutIcon size={20} color={colors.black[700]} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}