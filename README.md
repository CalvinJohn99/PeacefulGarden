# PeacefulGarden

peaceful garden is an mobile applicaiton provides users with the following functions:

view different motivating codes on the home tab, the code will be choose randomly from a collectino on firebase

view and post gratefulness post and create post, creatd a post stack in maincontainer, including GPostScreen, PostList and PostItem, CreatePost, and LikeButton

view self-awareness question and answers and create answer. question stack navigation is created in mainContainer, including QuestionScreen, QuestionViewAnswer screen, AnswerQuestion screen, and LikeButton

Diary allow users to create, edit, delete and view mood and journals. JMstack has been created in mainContainer, including MoodJournalScreen, ViewMoodJournal, Create Mood and Create Journal, and EditMood, EditJournal and FloatingButton

music allows users to listen to some relaxing music, including MusicScree and PlayMusic component

account setting includes all screens in account folder, and EditPost, EditAnsewr, EditAnserInput

account authentication is in Auth folder

installation:
dependencise required is listed in the file package.json

main navigation is in the following two files:
App.js file navigates the user to account authentication or the entire main tab navigation, based on account authenticate status

MainContainer.js file navigates the user within the main tab navigation. It includes the tab navigation and the stack navigaiton for each tab.


[You can find a video of our application here!](https://youtu.be/4bThcfhrXwU)
[You can find a kickstarter video for our application here!](https://youtu.be/EtwAMQa-Clk)
