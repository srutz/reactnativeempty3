import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ProductSchema } from "./app/ProductsSchema";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { prefetchWorker, usePrefetchProducts, useProducts } from "./app/UseProducts";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

const Stack = createNativeStackNavigator()
const client = new QueryClient()


export default function App() {

    return (
        <QueryClientProvider client={client}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Details" component={ProductsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    )
}

function HomeScreen() {
    const queryClient = useQueryClient()
    const navigation = useNavigation<NavigationProp<any>>()
    const { navigate } = navigation
    //usePrefetchProducts()
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 gap-2 items-center">
                <Text>Home-Screen</Text>
                <Button
                    title="Go to Products"
                    onPress={() => navigate("Details")}
                />
                <Button
                    title="Prefetch Products"
                    onPress={() => {
                        prefetchWorker(queryClient)
                    }}
                />
                <Button
                    title="Load data"
                    onPress={() => {
                        (async () => {
                            const r = await fetch("https://dummyjson.com/quotes/1", {
                                // no caching
                                method: "GET",
                                headers: {
                                    "Cache-Control": "no-cache",
                                    "Pragma": "no-cache",
                                    "Expires": "0",
                                }
                            })
                            const data = await r.json()
                            console.log(data)
                        })()
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

function ProductsScreen() {
    const navigation = useNavigation<NavigationProp<any>>()
    const { goBack } = navigation
    const { data } = useProducts({ skip: 0, limit: 20 })
    return (
        <SafeAreaView className="flex-1 bg-green-300">
            <View className="flex-1 items-center">
                <Text>Products-Screen</Text>
                <Button
                    title="Close"
                    onPress={() => goBack()}
                />
            </View>
        </SafeAreaView>
    )
}

