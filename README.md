# PeacefulGarden

You can find the video for our application [here!](https://youtu.be/4bThcfhrXwU) to see how our app works.\
You can find the kickstarter video for our application [here!](https://youtu.be/EtwAMQa-Clk) to understand the purpose of our application.

### Peaceful garden is a social media mobile applicaiton that provides users with the following functions:

* View different motivating codes on the home tab, the code will be chosen randomly from a collection on firebase
* View and post gratefulness posts, create posts stack in maincontainer, including GPostScreen, PostList and PostItem, CreatePost, and LikeButton
* View self-awareness questions and answers and create users own answers; question stack navigation is created in mainContainer, including QuestionScreen, QuestionViewAnswer screen, AnswerQuestion screen, and LikeButton
* A personal diary allows users to create, edit, delete and view moods and journals; JMstack has been created in mainContainer, including MoodJournalScreen, ViewMoodJournal, Create Mood and Create Journal, and EditMood, EditJournal and FloatingButton
* Music allows users to listen to some relaxing music, including MusicScree and PlayMusic component. The calming music can played in the background while users interact with the app, making for a relaxing experience.
* Account settings includes all screens in account folder, and EditPost, EditAnsewr, EditAnserInput
* Account authentication is in Auth folder

### Installation:
Dependencise required is listed in the file package.json

Main navigation is in the following two files:
* App.js file navigates the user to account authentication or the entire main tab navigation, based on account authenticate status.
* MainContainer.js file navigates the user within the main tab navigation. It includes the tab navigation and the stack navigaiton for each tab.
