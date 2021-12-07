import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import * as GLOBAL from '../config/global';
import Collapsible from 'react-native-collapsible';
import moment from 'moment';

moment().format();

const API_KEY = "46cf18f4c755f20a6f0bc4c50a3b5af5";
const API = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
const URL = "http://openweathermap.org/img/wn/";

export default function Main() {
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [data, setData] = useState(null);
    const [timezone, setTimezone] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(true);
    const [unit, setUnit] = useState('metric');
    const toggle = () => setCollapsed(!collapsed);

    const renderItem = ({item}) => (
        <Item
            dt={item.dt}
            temp={item.temp}
            weather={item.weather}
            onPress={toggle}
        />
    );

    const Item = ({dt,temp,weather,onPress}) => (
        <View
            style={styles.item}
        >   
            <TouchableOpacity style={styles.row} onPress={onPress}>
                <View style={styles.leftView}>
                    <Text style={styles.dateText}>{moment.unix(dt).format('ddd')}</Text>
                    <Text style={styles.dateText}>{moment.unix(dt).format('MMM Do')}</Text>
                </View>
                <View style={styles.middleView}>
                    <Image style={{width: 50, height: 50}} source={{uri:`${URL}${weather[0].icon}.png`}} />
                    <Text style={styles.description}>{weather[0].description}</Text>
                </View>
                <View style={styles.rightView}>
                    <Text style={styles.degreeMax}>{Math.round(temp.max)}°C</Text>
                    <Text style={styles.degreeMin}>{Math.round(temp.min)}°C</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const getData = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alert&units=${unit}&appid=${API_KEY}`)
            const d = await response.json();
            const z = d.timezone.split("/")
            setData(d.daily)
            setTimezone(z[1])
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        setUnit(GLOBAL.unit)
        getData();
        console.log(unit)
    },[GLOBAL.unit])
    
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
    
            let loc = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
            setLat(loc.coords.latitude.toFixed(2))
            setLon(loc.coords.longitude.toFixed(2))
            console.log(lat,lon,GLOBAL.unit)

        })();
        getData();
        console.log(GLOBAL.unit)
    },[]);

    return (
        <View style={styles.main}>
            <View>
                <Text style={styles.city}>{timezone}</Text>
            </View>
        {isLoading ? <ActivityIndicator/> : (
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 8,
    },
    city: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    leftView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleView: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 15,
    },
    title: {
        fontSize: 22,
    },
    description: {
        fontSize: 16,
        textTransform: 'capitalize',
    },
    degreeMax: {
        fontSize: 24,
    },
    degreeMin: {
        fontSize: 16,
    }
})