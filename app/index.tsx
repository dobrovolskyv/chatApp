import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react';
import {api} from "../convex/_generated/api";

const index = () => {

    const groups = useQuery(api.groups.get) || [];

  return (
    <View style={{flex:1}}>
      <ScrollView >
        {groups.map((group)=>(
            <View key={group._id}>
                <Text>{group.name}</Text>
                <Text>{group.description}</Text>
                <Image style={{width: 50, height: 50}} source={{uri: group.icon_url}} />
            </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})