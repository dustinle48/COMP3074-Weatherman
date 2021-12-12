import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import Collapsible from 'react-native-collapsible';
import { useSelector, useDispatch } from "react-redux";
import { setOption } from "../redux/actions";
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
    const [selectedIndex, setIndex] = useState(null)
    const [collapsed, setCollapsed] = useState(
        new Array(8).fill(false)
    );
    const handleTouch = (index) => {
        let c = collapsed
        let d = c[index]
        c.fill(false)
        c[index] = !d
        setIndex(index)
        setCollapsed(c)
    }
    const {option} = useSelector(state => state.optionReducer);
    const [unit, setUnit] = useState(null)
    const [wsUnit, setWSUnit] = useState(null)

    useEffect(() => {
        (async () => {
            let status
            do {
                status = await Location.requestForegroundPermissionsAsync();
            } while (status !== 'granted')
                
            getLocation().then(getData());
            setParameter();
        })();
    },[]);

    useEffect(() => {
        getLocation().then(getData());
        setParameter();
    },[option])

    const renderItem = ({item,index}) => (
        <Item
            dt={item.dt}
            index={index}
            temp={item.temp}
            weather={item.weather}
            humidity={item.humidity}
            wind_speed={item.wind_speed}
            feels_like={item.feels_like}
            onPress={()=>handleTouch(index)}
        />
    );

    const Item = ({dt,temp,weather,humidity,wind_speed,feels_like,index,onPress}) => (
        <View
            style={styles.item}
        >   
            <TouchableOpacity onPress={onPress}>
                <View style={styles.container}>
                    <View style={styles.leftView}>
                        <Text style={styles.dateText}>{moment.unix(dt).format('ddd')}</Text>
                        <Text style={styles.dateText}>{moment.unix(dt).format('MMM Do')}</Text>
                    </View>
                    <View style={styles.middleView}>
                        <Image style={{width: 50, height: 50}} source={{uri:`${URL}${weather[0].icon}.png`}} />
                        <Text style={styles.description}>{weather[0].description}</Text>
                    </View>
                    <View style={styles.rightView}>
                        <Text style={styles.degreeMax}>{Math.round(temp.max)}°{unit}</Text>
                        <Text style={styles.degreeMin}>{Math.round(temp.min)}°{unit}</Text>
                    </View>
                </View>
                <Collapsible style={styles.subContainer} collapsed={!collapsed[index]}>
                    <View style={styles.subLeftView}>
                        <Text style={styles.normal}>Humidity: {humidity} %</Text>
                        <Text style={styles.normal}>Wind speed: {Math.round(wind_speed)} {wsUnit}</Text>
                    </View>
                    <View style={styles.subRightView}>
                        <Text style={styles.normal}>Feels like:</Text>
                        <Text style={styles.normal}>Day: {Math.round(feels_like.day)}°{unit} - Night: {Math.round(feels_like.night)}°{unit}</Text>
                    </View>
                </Collapsible>
            </TouchableOpacity>
        </View>
    )
    const setParameter = () => {
        switch (option) {
            case 'metric':
                setUnit('C');
                setWSUnit('m/s');
                break;
            case 'standard':
                setUnit('K');
                setWSUnit('m/s');
                break;
            case 'imperial':
                setUnit('F');
                setWSUnit('mph');
                break;
            default:
                setUnit('C');
                setWSUnit('m/s');
        }
    }

    const getLocation = async () => {
        let loc = await Location.getCurrentPositionAsync();
        setLat(loc.coords.latitude.toFixed(2))
        setLon(loc.coords.longitude.toFixed(2))
    }

    const getData = async () => {
        try {
            //Sometimes this API returns weird results, for example: "wrong latitude, wrong longitude ??" and sometimes, it returns nothing at all.
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alert&units=${option}&appid=${API_KEY}`)
            let r = await response.json()
            let z = r.timezone.split("/")
            setData(r.daily)
            setTimezone(z[1])
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.main}>
        {isLoading ? <ActivityIndicator size="large" color="#00ff00"/> : (
            <View>
                <View>
                    <Text style={styles.city}>{timezone}</Text>
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.index}
                    extraData={selectedIndex}
                />
            </View>
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 40,
    },
    container: {
        flexDirection: 'row',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 8,
    },
    city: {
        fontSize: 24,
        marginTop: 35,
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
    subLeftView: {
        flex: 4
    },
    subRightView: {
        flex: 6,
        alignItems: 'flex-end'
    },
    subContainer: {
        borderTopColor: '#808080',
        borderTopWidth: 0.5,
        flexDirection: 'row',
        marginTop: 8,
        paddingTop: 8,
    },
    dateText: {
        fontSize: 15,
    },
    title: {
        fontSize: 24,
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
    },
    normal: {
        fontSize: 16,
    }
})