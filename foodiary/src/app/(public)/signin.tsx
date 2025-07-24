import { View, Text, FlatListComponent, Alert } from 'react-native'
import React from 'react'
import { AuthLayout } from '../../components/AuthLayout'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { router } from 'expo-router'
import { ArrowLeftIcon } from 'lucide-react-native'
import { colors } from '../../styles/colors'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../hooks/useAuth'
import { isAxiosError } from 'axios'

const schema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres")
})

export default function SignIn() {
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  })

  const { signIn } = useAuth()
  const submit = handleSubmit(async (formData) => {
    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      })
    } catch (error) {
            if (isAxiosError(error)) {
              console.log(error.response?.data)
            }
      Alert.alert("erro")
    }
  })

  return (
    <AuthLayout 
      icon='👤' 
      title='Entre em sua conta' 
      subtitle='Acesse sua conta para continuar'
    >
      <View className='flex-1 justify-between'>
        <View className='gap-6'>
          <Controller
            control={control}
            name='email'
            render={({ field, fieldState }) => (
              <Input 
                label='E-mail'
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='email' 
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              /> 
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field, fieldState }) => (
              <Input 
                label='Senha'
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='password'
                secureTextEntry 
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>

        <View className='flex-row gap-6'>
          <Button onPress={router.back} size='icon' color='gray'>
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>

          <Button className='flex-1' onPress={submit} loading={formState.isSubmitting}>
            Entrar
          </Button>
        </View>
      </View>
    </AuthLayout>
  )
}