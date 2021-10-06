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
    borderRadius: "5px",
    borderColor: "#333",
    borderRadius: 4,
  };

  return <Image source={{uri:`https://unsplash.it/150/200?image=${props.num}`}} style={style} />;
}

class GetImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: Array.from({length: imgQty}, () => Math.floor(Math.random() * 40)),
      chooseImg: null,
    };
  }
  handleChoose = (num) => {
    this.setState({chooseImg: num})
    this.props.onSelectImg(num)
 }
  render() {
   
    return (
      <View style={{display: "flex", flexDirection:"row", marginVertical: 10, justifyContent: "space-between"}}>
        {this.state.numbers.map((num, index) => {
          return (
          <TouchableOpacity  key={index} onPress={() => this.handleChoose(num)}>
            <GetRandomImage num={num} />
          </TouchableOpacity>
          );
          
        })}
      </View>
    );
  }
}

export default GetImage;
