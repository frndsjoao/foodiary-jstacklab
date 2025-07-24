import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function MealDetails() {
  const { mealId } = useLocalSearchParams()
  return (
    <View className='flex-1 items-center justify-center'>
      <Text>{mealId}</Text>
    </View>
  )
}