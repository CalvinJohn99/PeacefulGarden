import * as React from 'react';
import {View, Text} from 'react-native';

export default function JournalMoodScreen({navigation}) {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Home')}
                styles={{fontSize: 26, fontWeigt: 'bold'}}
            >Personal Journal and Mood Tracker Screen</Text>
        </View>

    );
}