import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {MessageBubble} from './MessageBubble';
import {queryMoreMessages} from '../../utils/utils';

// Counter to keep track of how many times `loadMoreRecentMessages` function has been called.
// We want to simulate a UX where user has scrolled till the most recent message available in
// chat. So for our example, we are going stop querying (and appending) new messages to the screen,
// once loadMoreRecentCounter is greater than 2.
// In real chat applications, you generally receive a flag from pagination api, which tells the app
// if user is at the most recent message in chat or not. 
let loadMoreRecentCounter = 0;

export const Message = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState();
  const [enableAutoscrollToTop, setEnableAutoscrollToTop] = useState(false);
  useEffect(() => {
    // When app is opened, we are going to render 50 messages on screen.
    // Generally this is where you connect to chat server and query first batch of messages.
    const initChat = async () => {
      const initialMessages = await queryMoreMessages(50, 0);
      setMessages(initialMessages);
    };

    initChat();
  }, []);

  // Add 10 more messages to end of the list.
  // In real chat application, this is where you have your pagination logic.
  const loadMoreOlderMessages = async () => {
    const newMessages = await queryMoreMessages(10);
    setMessages((m) => {
      return m.concat(newMessages);
    });
  };

  // Add 10 more messages to beginning of the list.
  // In real chat application, this is where you have your pagination logic.
  const loadMoreRecentMessages = async () => {
    if (loadMoreRecentCounter > 2) {
      // User is at the most recent message in chat.
      !enableAutoscrollToTop && setEnableAutoscrollToTop(true);
      return;
    }

    const newMessages = await queryMoreMessages(10);
    setMessages((m) => {
      return newMessages.concat(m);
    });

    loadMoreRecentCounter += 1;
  };

  /**
   * Simulates a send message feature of Chat applications. It simply adds a randomly
   * generated message at beginning of the list - it can either be a sent or received message.
   */
  const sendMessage = async (text) => {
    const newMessages = await queryMoreMessages(1, 0, text);
    setMessages((m) => {
      return newMessages.concat(m);
    });
    setInputMessage('')
    !enableAutoscrollToTop && setEnableAutoscrollToTop(true);
  };

  if (!messages) {
    // If the messages are not ready, lets not show anything.
    // Generally you can render some kind of loading indicator in this case.
    return null;
  }

  /**
   * NOTE:
   * 
   * - You can also control the scroll offset, at which `onEndReached` and `onStartReached`
   *   should be called, using props - onEndReachedThreshold and onStartReachedThrehols
   * - We are using `inverted` FlatList, since thats a common UX for Chat applications.
   */
  return (
    <View style={styles.safeArea}>
      <FlatList
        style={styles.messages}
        data={messages}
        inverted
        enableAutoscrollToTop={enableAutoscrollToTop}
        onEndReached={loadMoreOlderMessages}
        // onStartReached={loadMoreRecentMessages}
        renderItem={MessageBubble}
      />
      <View style={styles.message}>
        <Icon 
                style={styles.sendIcon}
                name='image'
                size={15}
                color='#3784FF'
                onPress={() => {sendMessage(inputMessage)}}
          />
        <Icon 
                style={styles.sendIcon}
                name='camera'
                size={15}
                color='#3784FF'
                onPress={() => {sendMessage(inputMessage)}}
          />
        <TextInput 
                style={styles.messageInput}
                value={inputMessage} 
                onChangeText={text => setInputMessage(text)}
                multiline={true}
                numberOfLines={4}
          />
          <Icon 
                style={styles.sendIcon}
                name='paper-plane'
                size={15}
                color='#3784FF'
                onPress={() => {sendMessage(inputMessage)}}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  messages: {
  },
  message: {
    width: '100%',
    // height: '15%',
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  sendIcon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 5,
    flexGrow: 1
  },
  messageInput: { 
    height: 50, 
    maxWidth: 300,
    borderColor: '#0C7EF2', 
    borderWidth: 1, 
    color: '#000', 
    flexGrow: 9, 
    borderRadius: 15, 
    paddingHorizontal: 15,
    paddingVertical: 5
  }
});
