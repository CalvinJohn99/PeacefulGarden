import * as React from 'react';
import { Text, View, StyleSheet, Button, ImageBackground, SafeAreaView, TouchableOpacity}  from 'react-native';
import { Audio } from 'expo-av';


export function RelaxMusicScreen({ navigation }) {

  const [sound, setSound] = React.useState();
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/relaxM.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  async function pauseSound()
  {
    await sound.pauseAsync();
  }  

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.box2}>
    <ImageBackground source={require('../../assets/1.jpg')} resizeMode="cover" style={styles.image}>

    <Button title="Play Sound" onPress={playSound} /> 

    <Button title="Pause Sound" onPress={pauseSound} />  

    </ImageBackground>
    </View>
  );
}

export function PianoMusicScreen({ navigation }) {

  const [sound, setSound] = React.useState();
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/pianoM.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  async function pauseSound()
  {
    await sound.pauseAsync();
  }  

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.box2}>
    <ImageBackground source={require('../../assets/2.jpg')} resizeMode="cover" style={styles.image}>

    <Button title="Play Sound" onPress={playSound} /> 

    <Button title="Pause Sound" onPress={pauseSound} />  

    </ImageBackground>
    </View>
  );
}

export function RainDropMusicScreen({ navigation }) {

  const [sound, setSound] = React.useState();
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/rainM.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  async function pauseSound()
  {
    await sound.pauseAsync();
  }  

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.box2}>
    <ImageBackground source={require('../../assets/3.jpg')} resizeMode="cover" style={styles.image}>

    <Button title="Play Sound" onPress={playSound} /> 

    <Button title="Pause Sound" onPress={pauseSound} />  

    </ImageBackground>
    </View>
  );
}

export function MedMusicScreen({ navigation }) {

  const [sound, setSound] = React.useState();
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/medM.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  async function pauseSound()
  {
    await sound.pauseAsync();
  }  

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.box2}>
    <ImageBackground source={require('../../assets/4.jpg')} resizeMode="cover" style={styles.image}>

    <Button title="Play Sound" onPress={playSound} /> 

    <Button title="Pause Sound" onPress={pauseSound} />  

    </ImageBackground>
    </View>
  );
}

export function SleepMusicScreen({ navigation }) {

  const [sound, setSound] = React.useState();
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/sleepM.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  async function pauseSound()
  {
    await sound.pauseAsync();
  }  

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.box2}>
    <ImageBackground source={require('../../assets/5.jpg')} resizeMode="cover" style={styles.image}>

    <Button title="Play Sound" onPress={playSound} /> 

    <Button title="Pause Sound" onPress={pauseSound} />  

    </ImageBackground>
    </View>
  );
}




export default function MusicScreen({navigation}) {

    return(

      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music', {screen: "A2" })}  >
        
          <ImageBackground source={require('../../assets/1.jpg')} resizeMode="cover"     style={styles.image}>
            <Text style={styles.text}>Stress Relax Music</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music', {screen: "A2" })}  >
        
        <ImageBackground source={require('../../assets/2.jpg')} resizeMode="cover"     style={styles.image}>
          <Text style={styles.text}>Light Piano Music</Text>
        </ImageBackground>
      </TouchableOpacity>


      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music', {screen: "A2" })}  >
        
        <ImageBackground source={require('../../assets/3.jpg')} resizeMode="cover"     style={styles.image}>
          <Text style={styles.text}>Rain Drop Sound</Text>
        </ImageBackground>
      </TouchableOpacity>


      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music', {screen: "A2" })}  >
        
        <ImageBackground source={require('../../assets/4.jpg')} resizeMode="cover"     style={styles.image}>
          <Text style={styles.text}>Meditation Music</Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Music', {screen: "A2" })}  >
        
        <ImageBackground source={require('../../assets/5.jpg')} resizeMode="cover"     style={styles.image}>
          <Text style={styles.text}>Sleeping Music</Text>
        </ImageBackground>
      </TouchableOpacity>

      </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    
  },
  text: {
    color: "white",
    fontSize: 30,
    lineHeight: 84,
    textAlign: "center",
  },
  box: {
    flex: 0.3,
    borderWidth: 3,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  box2: {
    flex: 1,
    borderWidth: 3,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },


  
});


  