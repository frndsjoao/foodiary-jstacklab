import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

interface MealProps {
  id: string
  name: string
}

export default function MealCard({ name, id }: MealProps) {
  return (
    <Link href={`/meals/${id}`} asChild>
      <TouchableOpacity>
        <Text className='text-base font-sans-regular text-gray-700'>
          Hoje, 12:25
        </Text>

        <View className='mt-2 px-4 py-5 flex-row items-center gap-3 border border-gray-400 bg-white rounded-2xl'>
          <View className='size-12 bg-gray-200 rounded-full items-center justify-center'>
            <Text>🔥</Text>
          </View>

          <View>
            <Text className='text-base font-sans-regular text-gray-700'>{name}</Text>
            <Text className='text-base font-sans-regular text-black-700'>Pão, manteiga e café</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}