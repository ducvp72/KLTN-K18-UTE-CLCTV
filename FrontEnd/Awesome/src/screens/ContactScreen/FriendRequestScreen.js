import React, {useLayoutEffect, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View,Image,FlatList} from 'react-native';
import { baseUrl } from '../../utils/Configuration';
import { Searchbar, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import { CommonActions } from '@react-navigation/native';
import {connect, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
// import Toast from 'react-native-simple-toast';
import overlay from "../../utils/overlay";
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../context/PreferencesContext';

export function FriendRequestScreen(props) {
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface);
  const { t } = useTranslation()
  const auth = useSelector((state) => state.auth);
  const [searchedList, setSearchedList] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [id, setId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const { load } =  React.useContext(PreferencesContext);

  useEffect(() => {
      getFriendReqList()
  }, [load]);

  const ConvertTime = (time) => {
    // console.log('time ' + time)
    if(time < 60)
      return Math.round(time) + 'm'
    else if(time < 1440)
      return Math.round(time/60) + 'h'
      else if(time < 10080)
        return Math.round(time/1440) + 'd'
        else return Math.round(time/10080) + 'w'
  }

  const SearchItemView = ({item}) => {
    const updatedAt = (new Date().getTime() - new Date(item.createdAt). getTime())/60000
    // console.log('ITEM >>> ' + JSON.stringify(item.sender))
    return (
      <TouchableRipple onPress={() => getItem(item.sender.fullname, item.sender.email, item.sender.avatar, 3, item.sender.id)}>
      <View style={[styles.itemStyle, {backgroundColor: backgroundColor}]} >
        <Image source={{uri: item.sender.avatar} }  
        style={styles.userPhoto} 
        />
        <View style={styles.userInfo} >
          <Text style={[styles.userFullname, {color: theme.colors.text }]}>
            {item.sender.fullname}
          </Text>
          <View style={styles.userMessage}>
            <Text style={[styles.userUsername, {color: theme.colors.text }]}>
              {'@'}{item.sender.subname ?? item.sender.username}
            </Text>
            <Text style={[styles.userMessageTime, {color: theme.colors.text }]}>
              {ConvertTime(updatedAt)}
            </Text>
          </View>
        </View>
      </View>
      </TouchableRipple>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: backgroundColor,
        }}>
      </View>
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
  
  const getFriendReqList = () => {
    axios({
      method: 'get',
      url: `${baseUrl}/friend/getListWaiting`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {}
    })
    .then(function (response) {
      if(response.data){
        setFriendReqList(response.data.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }))
        setSearchedList(response.data.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }))
      } else {
        console.log('Khong co loi moi ket ban')
      }
    })
    .catch(function (error) {
        const { message } = error;
        console.log(message);
    });
  };

  const onSearch = (searchText) => {
        setSearchQuery(searchText)
        let text = searchText.toLowerCase()
        let trucks = friendReqList
        let filteredName = trucks.filter((item) => {
          return item.sender.fullname.toLowerCase().match(text) 
          || item.sender.subname.toLowerCase().match(text)
          || item.sender.username.toLowerCase().match(text)
        })
        console.log(filteredName)
        if(searchText)
          setSearchedList(filteredName)
        else
          setSearchedList(friendReqList)
  }

  return (
      <>
        <Searchbar style={[styles.searchbar, {backgroundColor: backgroundColor}]}
          placeholder={t('common:search')}
          onChangeText={(query) => onSearch(query)}
          value={searchQuery}
          onIconPress={onSearch}
          onSubmitEditing={onSearch}
          // onBlur={() => setIsSearching(false)}
          // onFocus={(query) => onChangeSearch(query)}
        />
          <View style={{height: 371}}>
            <FlatList
            data={searchedList}
            // onEndReached={onSearch}
            // onEndReachedThreshold={0.1}
            // keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={SearchItemView}
            // getItemLayout={(data, index) => (
            //   {length: 100, offset: 100 * index, index}
            // )}
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
    // resizeMode: 'contain',
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
    textAlign: 'right'
  },
  sectionHeaderContainer: {
    height: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  friendReqContainer: {
    flex:1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B6B6B4',
  },
  friendReqIcon: {
    marginLeft: 30,
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
  userMessageTime: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexGrow: 1,
    // flex: 1,
    fontSize: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});


export default FriendRequestScreen