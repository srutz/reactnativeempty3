import "./global.css"

import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Product, ProductSchema } from "./app/ProductsSchema";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { prefetchWorker, usePrefetchProducts, useProducts } from "./app/UseProducts";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

const Stack = createNativeStackNavigator()
const client = new QueryClient()


export default function App() {

    return (
        <QueryClientProvider client={client}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Products" component={ProductsScreen} />
                    <Stack.Screen name="Details" component={ProductDetailsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    )
}

type Quote = { id: number, quote: string, author: string }

async function delay(delayMs: number) {
    return new Promise((resolve) => setTimeout(resolve, delayMs))
}



function useQuote(id: number) {
    const [ quote, setQuote ] = useState<Quote>()
    const [loading, setLoading ] = useState(false)
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const r = await fetch("https://dummyjson.com/quotes/"
                    + encodeURIComponent(id)
                )
                const data = await r.json() as Quote
                console.log("data", data)
                setQuote(data)
                await delay(1_000)
            } finally {
                setLoading(false)
            }
        })()
    }, [ id ])
    return { quote, loading }
}

function HomeScreen() {
    const navigation = useNavigation<NavigationProp<any>>()
    const { navigate } = navigation
    const [id, setId] = useState(1)
    const { quote, loading } = useQuote(id)
    console.log(loading,quote?.quote)
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 flex gap-4 items-center">
                <Button title="Next" onPress={() => setId(id+ 1)} />
                {loading 
                    ? (<Text>Lade noch...</Text>)
                    : (<Text className="font-fixed">{quote?.quote}</Text>)
                }
            </View>
        </SafeAreaView>
    )
}

function ProductsScreen() {
    const navigation = useNavigation<NavigationProp<any>>()
    const { goBack } = navigation
    const { data } = useProducts({ skip: 0, limit: 20 })
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1  flex gap-2 items-center bg-neutral-300">
                <Text>Products-Screen</Text>
                <FlatList
                    className="self-stretch"
                    data={data?.products || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ProductsItem item={item} />}
                />
                <Button
                    title="Close"
                    onPress={() => goBack()}
                />
            </View>
        </SafeAreaView>
    )
}

function ProductDetailsScreen() {
    const r = useRoute()
    const { item } = r.params as { item: Product }
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 flex gap-4 bg-white p-4 my-4 mx-4 rounded-lg" >
            <View className="h-[300px] items-center">
                    <HorizontalImageGalleryWithDots images={item.images} />
                </View>
                <View className="flex-1 flex">
                    <HeaderText>{item.title}</HeaderText>
                    <LightText>{item.description}</LightText>
                </View>
            </View>
        </SafeAreaView>
    )
}


function ProductsItem({ item }: { item: Product }) {
    const navigation = useNavigation<NavigationProp<any>>()
    return (
        <Pressable onPress={() => {
            navigation.navigate("Details", {
                item: item
            })
        }}>
            <View className="flex flex-row gap-4 bg-white p-2 my-1 mx-4 rounded-lg" >
                <View className="flex">
                    <Image className="w-24 h-24 rounded-lg" source={{ uri: item.thumbnail }} />
                </View>
                <View className="flex-1 flex">
                    <HeaderText>{item.title}</HeaderText>
                    <LightText>{item.description}</LightText>
                </View>
            </View>
        </Pressable>
    )
}


function LightText({ children }: { children: ReactNode }) {
    return (
        <Text className="text-neutral-600">
            {children}
        </Text>
    )
}

function HeaderText({ children }: { children: ReactNode }) {
    return (
        <Text className="font-bold">
            {children}
        </Text>
    )
}


function HorizontalImageGalleryWithDots({ images }: { images: string[] }) {
    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <View className="flex py-4 rounded-lg bg-neutral-300 items-center">
            <ScrollView
                horizontal
                className="w-64 h-64"
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const currentIndex = Math.round(contentOffsetX / 96); // Assuming 96px width for each image
                    setActiveIndex(currentIndex);
                }}
                scrollEventThrottle={16}
            >
                {images.map((item, index) => (
                    <View className="w-64 h-64" key={index}>
                        <Image
                            source={{ uri: item }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </ScrollView>
            {images.length > 1 && (
                <View className="mt-2 flex flex-row justify-center mt-2">
                    {images.map((_, index) => (
                        <View
                            key={index}
                            className={`w-2 h-2 rounded-full mx-1 ${index === activeIndex ? "bg-blue-500" : "bg-neutral-500"
                                }`}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

