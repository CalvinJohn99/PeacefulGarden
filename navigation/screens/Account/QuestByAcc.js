import * as React from "react";
import { View, FlatList } from "react-native";
import {
  useAccountUserid,
  useAccountUsername,
  useQuestionList,
} from "../../components/CommonFunctions.js";
import ListAnswerbyQuestion from "../../components/EditAnswer";
import { SCREEN_WIDTH } from "../../../commonStyles.js";

// View question by account component
// called by AccountInfo
export default function QuestByAcc({ navigation }) {
  // get userID
  const userID = useAccountUserid();
  // get username
  const username = useAccountUsername();
  // get question list
  const Qlist = useQuestionList();

  // render view
  return (
    <View>
      <FlatList
        style={{
          width: SCREEN_WIDTH * 0.92,
          borderRadius: 20,
        }}
        data={Qlist}
        renderItem={({ item }) => (
          <View>
            {/* call ListAnswerbyQuestion,
                pass variables quesiton, username and userID*/}
            <ListAnswerbyQuestion
              question={item}
              username={username}
              userID={userID}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
}
