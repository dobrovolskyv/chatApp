import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'convex/react';
import { api } from "../convex/_generated/api";
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog";

const index = () => {

  const groups = useQuery(api.groups.get) || [];
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);

   useEffect(()=>{
    const loadUser = async ()=>{
      const user = await AsyncStorage.getItem('user');
      if( !user){
        setTimeout(()=>{
          setVisible(true)
        }, 100)
      } else {
        setName(user)
      }
    }
    loadUser();
   },[])


   const setUser = async () =>{
    let r = (Math.random()+ 1).toString(36).substring(7);
    const userName = `${name}#${r}`;
    await AsyncStorage.setItem('user', userName);
    setName(userName);
    setVisible(false);
   }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {groups.map((group) => (
          <Link href={{ pathname: '/(chat)/[chatid]', params: { chatid: group._id } }} key={group._id.toString()} asChild>
            <TouchableOpacity style={styles.group}>
              <Image style={{ width: 50, height: 50 }} source={{ uri: group.icon_url }} />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: '#888' }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
      <Dialog.Container visible={visible}>
          <Dialog.Title>Username required</Dialog.Title>
          <Dialog.Description>Please insert a name to start chatting</Dialog.Description>
          <Dialog.Input onChangeText={setName}/>
          <Dialog.Button label="set name" onPress={setUser}/>
      </Dialog.Container>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f5ea'
  },
  group: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: 'black',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  }
})