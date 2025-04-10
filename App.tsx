import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState } from "react";
import { Button, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

function BigText({ children } : { children: ReactNode }) {
    return (
        <Text className="text-4xl bg-neutral-300">
            {children}
        </Text>
    )
}


export default function App() {
    const [ count, setCount ] = useState(() => {
        return 1
    })
    console.log("render app...", count)
    return (
    <View className="flex-1 flex justify-center items-center">
        <View className="flex gap-2 " >
            <BigText>Count {count}</BigText>
            <Button title="Increment" 
                onPress={() => {
                    setCount((oldCount) => { return oldCount + 1 })
                    console.log("button clicked")
                    setCount((oldCount) => oldCount + 1)
                    setCount((oldCount) => oldCount + 1)
                }} />
        </View>
        <StatusBar style="auto" />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})


