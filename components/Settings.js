import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import * as GLOBAL from '../config/global';

const options = [
    'metric',
    'standard',
    'imperial'
];

export default function Settings() {
    const [unit, setUnit] = useState('metric')

    useEffect(()=>{
        GLOBAL.unit = unit
        console.log(GLOBAL.unit)
    },[unit])

    const optionList = options.map((name,index) => {
        return (
            <View>
                <TouchableOpacity key={index} onPress={()=>setUnit(name)}>
                    <Text>{name}</Text>
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <View>
            <Text>Settings</Text>
            {optionList}
        </View>
    )
}