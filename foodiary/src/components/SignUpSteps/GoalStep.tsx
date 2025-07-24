import { View, Text } from 'react-native'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { SignUpFormData } from './signUpSchema'
import { OptionsSelector } from '../OptionsSelector'

export default function GoalStep() {
  const form = useFormContext<SignUpFormData>()

  return (
<Controller
      control={form.control}
      name="goal"
      render={({ field }) => (
        <OptionsSelector
          value={field.value}
          onChange={field.onChange}
          options={[
            { icon: '🥦', title: 'Perder peso', value: 'lose' },
            { icon: '🍍', title: 'Manter o peso', value: 'maintain' },
            { icon: '🥩', title: 'Ganhar peso', value: 'gain' },
          ]}
        />
      )}
    />
  )
}