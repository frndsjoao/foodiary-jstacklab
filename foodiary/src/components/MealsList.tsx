import { View, Text, FlatList } from 'react-native'
import React from 'react'
import MealCard from './MealCard'
import { DateSwitcher } from './DateSwitcher'
import { DailyStats } from './DailyStats'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../services/httpClient'

type Meal = {
  name: string
  id: string
  icon: string
  foods: { name: string, quantity: string, calories: number, proteins: number, carbohydrates: number, fats: number }[]
  createdAt: Date
}

function MealsListHeader() {
  const { user } = useAuth()
  return (
    <>
      <DateSwitcher />
      <View className="mt-2">
        <DailyStats
          calories={{ current: 500, goal: Number(user!.calories) }}
          carbohydrates={{ current: 70, goal: Number(user!.carbohydrates) }}
          proteins={{ current: 10, goal: Number(user!.proteins) }}
          fats={{ current: 10, goal: Number(user!.fats) }}
          /> 
      </View>

      <View className="h-px mt-7 bg-gray-200" />

      <Text className='text-black-700 m-5 text-base font-sans-medium uppercase tracking-[1.28px]'>
        Refeições
      </Text>
    </>
  )
}

function Separator() {
  return <View className='h-8' />
}

export function MealsList() {
  const { bottom } = useSafeAreaInsets()
  
  const { data: meals } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ meals: Meal[] }>("/meals", {
        params: { date: "2025-07-20" }
      })
      return data.meals
    }
  })

  return (
    <FlatList
      className='pt-4'
      data={meals}
      contentContainerStyle={{ paddingBottom: 80 + bottom + 16 }}
      keyExtractor={meal => meal.id}
      renderItem={({ item }) => (
        <View className='mx-5'>
          <MealCard id={item.id} name={item.name} />
        </View>
      )}
      ListHeaderComponent={<MealsListHeader />}
      ItemSeparatorComponent={() => <Separator />}
    />
  )
}