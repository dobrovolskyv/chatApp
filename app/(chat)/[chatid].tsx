import { Text, View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ListRenderItem, FlatList } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';


const Page = () => {
    const { chatid } = useLocalSearchParams();
    const [user, setUser] = useState<string | null>(null)
    const convex = useConvex();
    const navigation = useNavigation();
    const [newMessage, setNewMessage] = useState('');
    const addMessage = useMutation(api.messages.sendMessage);
    const messages = useQuery(api.messages.get, { chitId: chatid as Id<'groups'> }) || [];

    useEffect(() => {
        const loadGroup = async () => {
            const groupInfo = await convex.query(api.groups.getGroup,
                { id: chatid as Id<'groups'> });
            navigation.setOptions({ headerTitle: groupInfo?.name })
        }
        loadGroup();
    }, [chatid])

    useEffect(() => {
        const loadUser = async () => {
            const user = await AsyncStorage.getItem('user');
            setUser(user);
        }
        loadUser();
    }, [])

    const handleSendMessage = () => {
        addMessage({
            group_id: chatid as Id<'groups'>,
            content: newMessage,
            user: user || 'Anin'
        });
        setNewMessage('')
    }

    const renderMessage: ListRenderItem<Doc<'messages'>> = ({ item }) => {
        const isUserMessage = item.user === user;

        return (
            <View>
                <Text>{item.content}</Text>
            </View>
        )
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                {/* Render the messages */}
                <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item._id.toString()} ListFooterComponent={<View style={{ padding: 5 }} />} />

                {/* Bottom message input */}
                <View style={styles.inputContainer}>
                 
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput style={styles.textInput} value={newMessage} onChangeText={setNewMessage} placeholder="Type your message" multiline={true} />

                        {/* <TouchableOpacity style={styles.sendButton} onPress={captureImage}>
                            <Ionicons name="add-outline" style={styles.sendButtonText}></Ionicons>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={newMessage === ''}>
                            <Ionicons name="send-outline" style={styles.sendButtonText}></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F5EA',
    },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        elevation: 3,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    sendButton: {
        backgroundColor: '#EEA217',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-end',
    },
    sendButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    userMessageContainer: {
        backgroundColor: '#791363',
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
        flexWrap: 'wrap',
    },
    userMessageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: '#c7c7c7',
    },
});

export default Page