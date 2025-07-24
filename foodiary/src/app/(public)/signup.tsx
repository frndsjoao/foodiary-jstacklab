import { Alert, View } from 'react-native'
import React, { useState } from 'react'
import { AuthLayout } from '../../components/AuthLayout'
import GoalStep from '../../components/SignUpSteps/GoalStep'
import { GenderStep } from '../../components/SignUpSteps/GenderStep'
import { Button } from '../../components/Button'
import { router } from 'expo-router'
import { colors } from '../../styles/colors'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '../../components/SignUpSteps/signUpSchema'
import { BirthDateStep } from '../../components/SignUpSteps/BirthdateStep'
import { HeightStep } from '../../components/SignUpSteps/HeightStep'
import { WeightStep } from '../../components/SignUpSteps/WeightStep'
import { ActivityLevelStep } from '../../components/SignUpSteps/ActivityLevelStep'
import { AccountStep } from '../../components/SignUpSteps/AccountStep'
import { useAuth } from '../../hooks/useAuth'
import { AxiosError, isAxiosError } from 'axios'

export default function SignUp() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const form = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const steps = [
    { icon: '🎯', title: 'Qual é o seu objetivo?', subtitle: 'O que você pretende alcançar com a dieta?', component: GoalStep },
    { icon: '👥', title: 'Qual é o seu gênero?', subtitle: 'Seu gênero influencia no tipo de dieta', component: GenderStep },
    { icon: '🐣', title: 'Que dia você nasceu?', subtitle: 'Cada faixa etária responde de forma única', component: BirthDateStep },
    { icon: '📐', title: 'Qual é sua altura?', subtitle: 'Você pode inserir uma estimativa', component: HeightStep },
    { icon: '⚖️', title: 'Qual é seu peso?', subtitle: 'Você pode inserir uma estimativa', component: WeightStep },
    { icon: '🏓', title: 'Qual seu nível de atividade?', subtitle: 'Estime sempre pra menos', component: ActivityLevelStep },
    { icon: '👤', title: 'Crie sua conta', subtitle: 'Para poder visualizar o seu progresso', component: AccountStep },
  ]

  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1;

  function handlePreviousStep() {
    if(currentStepIndex === 0) {
      router.back()
      return
    }
    setCurrentStepIndex(prev => prev - 1)
  }
  
  function handleNextStep() {
    if(currentStepIndex === steps.length - 1) {
      return
    }
    setCurrentStepIndex(prev => prev + 1)
  }

  const { signUp } = useAuth()
  const submit = form.handleSubmit(async (formData) => {
    try {
      const [day, month, year] = formData.birthDate.split('/')
      await signUp({
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: Number(formData.activityLevel),
        gender: formData.gender,
        goal: formData.goal,
        birthDate: `${year}-${month}-${day}`,
        account: {
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }
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
      icon={currentStep.icon}
      title={currentStep.title}
      subtitle={currentStep.subtitle}
    >
      <View className='flex-1'>
        <View className='flex-1 justify-between'>
          <FormProvider {...form}>
            <currentStep.component />
          </FormProvider>
        </View>

        <View className='flex-row gap-6 justify-between'>
          <Button onPress={handlePreviousStep} size='icon' color='gray'>
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>

          {isLastStep ? (
            <Button 
              className="flex-1" 
              onPress={submit} 
              loading={form.formState.isSubmitting}
            >
              Criar conta
            </Button>
          ) : (
            <Button size="icon" onPress={handleNextStep}>
              <ArrowRightIcon size={20} color={colors.black[700]} />
            </Button>
          )}
        </View>
      </View>
    </AuthLayout>
  )
}