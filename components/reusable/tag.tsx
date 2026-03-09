import React from 'react'
import { View } from 'react-native'
import { ThemedText } from './themed-text'
import { cn } from '@/utils/cn.utils'

const Tag = ({ label, className }: { label: string, className?: string }) => {
  return (
    <View
      className={cn('bg-accent dark:bg-accentDark rounded-full px-2 py-1 min-w-12', className)}
      style={{ alignSelf: 'flex-start' }}
    >
      <ThemedText className='text-center font-sans'>{label}</ThemedText>
    </View>
  )
}

export default Tag