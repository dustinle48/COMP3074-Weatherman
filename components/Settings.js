import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBox, Divider } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";
import { setOption } from "../redux/actions";

const options = [
    'metric',
    'standard',
    'imperial'
];

export default function Settings() {
    const [checked,setChecked] = useState([true,false,false]);
    const {option} = useSelector(state => state.optionReducer);
    const dispatch = useDispatch();
    const handleCheck = (name,index) => {
        let c = checked
        c.fill(false)
        c[index] = true
        setChecked(c)
        dispatch(setOption(name))
    }

    const optionList = options.map((name,index) => {
        return (
            <View>
                <CheckBox
                    key={index}
                    title={name}
                    checked={checked[index]}
                    onPress={()=>handleCheck(name,index)}
                />
            </View>
        )
    })

    return (
        <View>
            <Text style={styles.title}>Temperature Unit</Text>
            {optionList}
            <Divider style={styles.divider} orientation="horizontal" />
            <Text style={styles.about}>Le Duc Thinh</Text>
            <Text style={styles.about}>101110291</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 10
    },
    divider: {
        marginVertical: 20
    },
    about: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})