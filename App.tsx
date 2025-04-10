import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { Dimensions, ScaledSize, StyleSheet, Text, View } from 'react-native';


export default function App() {
    const [ dimensions, setDimensions] = useState(() => {
        const { width, height } = Dimensions.get("window")
        return {
            width,
            height,
            portrait: height > width,
        }
    })
    useEffect(() => {
        const l = ({ window } : { window: ScaledSize, screen: ScaledSize}) => {
            console.log("Window size changed", window.width, window.height)
            setDimensions({
                width: window.width,
                height: window.height,
                portrait: window.height > window.width,
            })
        }
        const sub = Dimensions.addEventListener("change", l)
        return () => sub.remove() 
    }, [])
    console.log("rerender", dimensions)
    return (
        <View style={styles.container}>
            <View className="h-4 bg-red-300">
                <Text className="bg-red-300">Hello World!</Text>
                <Text className="bg-neutral-300 text-2xl whitespace-pre">{JSON.stringify(dimensions, null, 2)}</Text>
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


