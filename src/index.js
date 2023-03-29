import React, { useEffect, useState } from "react";
import { Text, View, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl,Image , LogBox} from "react-native";
import * as Location from "expo-location";

const openWeatherKey = 'c2585c35ff107198c5006ebf027d06ff';

let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minute&appid=${openWeatherKey}&lang=vi`;
const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadForecast = async () => {
        setRefreshing(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Test denied');
        }
        // lay dia diem hien tai

        let location = await Location.getCurrentPositionAsync({ enableHightAccuracy: true });

        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        const data = await response.json();
LogBox.ignoreLogs(['test']);
LogBox.ignoreAllLogs();
        if (!response.ok) {
            Alert.alert('looix');
        } else {
            setForecast(data);
        }
        setRefreshing(false);
    }
    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        )
    }

    const current = forecast.current.weather[0];
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadForecast()} />

            }
                style={{ marginTop: 50 }}
            >
                <Text style={styles.title}>

                    Thời tiết hiện tại

                </Text>
                <Text style={{ alignItems: 'center', textAlign: 'center' }}>
                    Địa điểm 
                    {forecast.current.name}
                </Text>
                <View style={styles.current}>
            <Image 
            style={styles.largeIcon}
            source={{
                uri:`http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
            />
            <Text style={styles.currentDoC}>
                {Math.round(forecast.current.temp)}°C
            </Text>
                </View>

<Text style={styles.currentDes}>
    {current.description}
</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Weather

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECDBBA'
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#C84B31'
    },
    current:{
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center'
    },
    largeIcon:{
        width:300,
        height:250
    },
    currentDoC:{
        fontSize:32,
        fontWeight:'bold',
        textAlign:'center'
    },
    currentDes:{
        width:'100%',
        textAlign:'center',
        fontWeight:200,
        fontSize:24,
        marginBottom:5


    }

})