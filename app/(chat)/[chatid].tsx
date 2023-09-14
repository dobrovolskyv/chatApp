import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { useLocalSearchParams } from 'expo-router'

const Page = () => {
    const { chatid } = useLocalSearchParams();


    return (
        <View>
            <Text>Page seadf</Text>
        </View>
    )

}

export default Page