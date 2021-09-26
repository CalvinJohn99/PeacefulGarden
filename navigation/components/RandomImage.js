import React from "react";
import {
    View,
    Image,

  } from "react-native";
  import { TouchableOpacity } from "react-native-gesture-handler";
const imgQty = 5;

function GetRandomImage(props) {
  const style = {
    width: 60,
    height: 60,
    margin: 4,
    border: "5px solid #333",
    borderBottom: "5px solid #222",
    borderLeft: "5px solid #222",
    borderRadius: 4,
    transition: "background-image 1s ease-in-out",

  };

  return (
    <TouchableOpacity>
        <Image source={{uri:`https://unsplash.it/150/200?image=${props.num}`}} style={style} />
    </TouchableOpacity>
  )
}

class GetImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: Array.from({length: imgQty}, () => Math.floor(Math.random() * 40))
    };
  }

  render() {
    return (
      <View style={{display: "flex", flexDirection:"row"}}>
        {this.state.numbers.map((num, index) => {
          return <GetRandomImage num={num} key={index} />;
        })}
      </View>
    );
  }
}

export default GetImage;
