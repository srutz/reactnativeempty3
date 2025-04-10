import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect, useState } from "react";
import { Button, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';


function BigText({ children } : { children: ReactNode }) {
    return (
        <Text className="text-4xl bg-neutral-300">
            {children}
        </Text>
    )
}

function useInterval(f: () => void, delay: number) {
    useEffect(() => {
        const id = setInterval(f, delay)
        return () => {
            clearInterval(id)
        }
    }, [])
}

function useTime(delay: number) {
    const [time, setTime ] = useState(new Date())
    useInterval(() => setTime(new Date()), delay)
    const a = { age: 17, iq: 27}
    const b = structuredClone(a)
    return time
}

export default function App() {
    const time = useTime(3_600_000)
    return (
    <View className="flex-1 flex justify-center items-center">
        <View className="flex gap-2 "   >
            <BigText>{time.toTimeString()}</BigText>
            <Button title="butt" onPress={() => {
                const [stuff, setStuff] = useState(0)
            }}/>
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


