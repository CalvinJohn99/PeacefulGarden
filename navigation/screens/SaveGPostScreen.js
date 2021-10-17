import * as React from "react";
import { View, Text } from "react-native";
import PostItem from "../components/PostItem";

export default function GPostScreen({ navigation }) {
  return (
    <PostItem></PostItem>

    /*
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Home')}
                styles={{fontSize: 26, fontWeigt: 'bold'}}
            >Gratefulness Post Screen</Text>
        </View>
        */
  );
}
