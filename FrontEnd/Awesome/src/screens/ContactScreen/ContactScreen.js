import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View,Image, ToastAndroid, Keyboard} from 'react-native';
import { baseUrl } from '../../utils/Configuration';
import { Searchbar, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector} from 'react-redux';
import axios from 'axios';
// import Toast from 'react-native-simple-toast';
import overlay from "../../utils/overlay";
import { useTranslation } from 'react-i18next';
import AlphabetList from "react-native-flatlist-alphabet";
import { PreferencesContext } from '../../context/PreferencesContext';

export function ContactScreen(props) {
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface);
  const { t } = useTranslation()
  const auth = useSelector((state) => state.auth);
  const [searchedList, setSearchedList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { load } =  React.useContext(PreferencesContext);

  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  useEffect(() => {
    getFriendList()
  }, [load]);

  const SearchItemView = (item) => {
          // console.log('Transform Data >>>>>> ' + JSON.stringify(item))
    return (
      <TouchableRipple onPress={() => getItem(item.friends.fullname, item.friends.email, item.friends.avatar, 1, item.friends.id)}>
      <View style={[styles.itemStyle, {backgroundColor: backgroundColor}]} >
        <Image source={{uri: item.friends.avatar} }  
        style={styles.userPhoto} 
        />
        <View style={styles.userInfo} >
          <Text style={[styles.userFullname, {color: theme.colors.text }]} >
            {item.friends.fullname}
          </Text>
          <Text style={[styles.userUsername, {color: theme.colors.text }]} >
            {'@'}{item.friends.subname ?? item.friends.username}
          </Text>
        </View>
      </View>
      </TouchableRipple>
    );
  };

  const getItem = (fullname, email, avatar, isFriend, id) => {
    props.navigation.navigate('OtherUserProfile', { 
      otherUserFullname: fullname,
      otherUserEmail: email,
      otherUserAvatar: avatar,
      isFriend: isFriend,
      otherUserId: id
    });
  };
  
  const getFriendList = async() => {
    await axios({
      method: 'get',
      url: `${baseUrl}/friend/getListFriend`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {}
    })
    .then(function (response) {
      if(response.data){
        setFriendList(response.data)
        setSearchedList(response.data)
      } else {
        ToastAndroid.show(t('common:empty'), 3)
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  };

  const onSearch = (searchText) => {
    setSearchQuery(searchText)
    let text = searchText.toLowerCase()
    let trucks = friendList
    let filteredName = trucks.filter((item) => {
      return item.friends.fullname.toLowerCase().match(text) 
      || item.friends.username.toLowerCase().match(text)
    })

    if(searchText)
      setSearchedList(filteredName)
    else
      setSearchedList(friendList)
  }

  const renderSectionHeader = (section) => {
    return (
      <View style={[styles.sectionHeaderContainer, {backgroundColor: theme.colors.primary}]}>
        <Text style={{color: theme.colors.text}}>{section.title}</Text>
      </View>
    );
  };

  return (
      <>
        <Searchbar style={[styles.searchbar, {backgroundColor: backgroundColor}]}
          placeholder={t('common:search')}
          onChangeText={(query) => onSearch(query)}
          value={searchQuery}
          onIconPress={() => onSearch(searchQuery)}
          onSubmitEditing={() => onSearch(searchQuery)}
        />
          <View style={[styles.friendReqContainer, {backgroundColor: backgroundColor, maxHeight: 60}]}
          >
            <Icon 
              name='user-clock'
              size={25}
              color={theme.colors.text}
              style={[styles.friendReqIcon]}
            />
            <Text style={[styles.friendReqText, {color: theme.colors.text }]} 
            onPress={() => {
              props.navigation.navigate('FriendRequest')
            }}
            >
              {t('common:friendRequest')}
            </Text>
          </View>
          <View style={{height: 371}}>
            <AlphabetList
              data={searchedList}
              renderItem={(item) => SearchItemView(item)}
              renderSectionHeader={(section) => renderSectionHeader(section)}
              getItemHeight={() => 50}
              sectionHeaderHeight={50}
              indexLetterColor={theme.colors.text}
            />
          </View>
      </>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginBottom: 0,
    borderColor: '#B6B6B4',
    borderWidth: 1,
    borderRadius: 0,
    
  },
  scrollViewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  centerText: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
  itemStyle: {
    padding: 10,
    // margin: 0,
    backgroundColor: '#fff',
    flex:1,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#B6B6B4',
  },
  userPhoto: {
    minWidth: 50,
    minHeight: 50,
    maxHeight: 50,
    maxWidth: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf:'center',
    flexGrow: 1,
    backgroundColor: 'white',
    flex: 1,
  },

  userInfo: {
    flexGrow: 8,
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10
  },
  userFullname: {
    // marginTop: 1,
    // borderWidth: 1,
    // borderColor: '#B6B6B4',
    flexGrow: 6,
    fontSize: 20,
    color: '#000',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userUsername: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexGrow: 4,
    fontSize: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMessage: {
    flexGrow: 8,
    flex: 1,
    flexDirection: 'row',
  },
  userMessageTime: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexGrow: 1,
    // flex: 1,
    fontSize: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  sectionHeaderContainer: {
    height: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  friendReqContainer: {
    flex:1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B6B6B4',
  },
  friendReqIcon: {
    marginLeft: 27,
    alignSelf:'center',
    alignItems: 'center',
  },
  friendReqText: {
    // marginTop: 1,
    // borderWidth: 1,
    // borderColor: '#B6B6B4',
    marginLeft: 20,
    fontSize: 20,
    alignSelf:'center',
    alignItems: 'center',
  },
});


export default ContactScreen