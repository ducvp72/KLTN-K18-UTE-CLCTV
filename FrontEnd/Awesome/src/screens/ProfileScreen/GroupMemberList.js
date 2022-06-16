import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View,Image,FlatList} from 'react-native';
import { Searchbar, useTheme, Menu, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { baseUrl } from '../../utils/Configuration';
import {connect, useSelector} from 'react-redux';
// import Toast from 'react-native-simple-toast';
import overlay from "../../utils/overlay";
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../context/PreferencesContext';

export function GroupMemberList(props) {
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface);
  const { t } = useTranslation()
  const auth = useSelector((state) => state.auth);
  const [searchedList, setSearchedList] = useState(props.route.params.memberList);
  const [memberList, setMemberList] = useState(props.route.params.memberList)
  const [isAdmin, setIsAdmin] = useState(props.route.params.isAdmin)
  const groupId = props.route.params.groupId
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState('');
  const { toggleLoad } = React.useContext(PreferencesContext);

  const promoteAdmin = (memberId) => {
    axios({
      method: 'post',
      url: `${baseUrl}/group/setAdminGroup`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: groupId,
        userId: memberId
      }
    })
    .then((response) => {
      if(response) 
      {
        setIsAdmin(false);
        toggleLoad()
        console.log('Promote admin complete!')
      }
    })
    .catch(function (error) {
      const { message } = error;
      console.log("Promote admin >>> " + message);
    });
  }

  const removeMember = async(memberId) => {
    console.log('removeMember 1')
    console.log('removeMember memberList > ', memberList)
    let filteredArray = await memberList.filter((item) => {
      item.userId != memberId
    })
    console.log('removeMember filteredArray > ', filteredArray)
    setMemberList(filteredArray);
    setSearchedList(filteredArray);
  }

  const deleteMember = (memberId, mmeberFullname) => {
    axios({
      method: 'delete',
      url: `${baseUrl}/group/deleteMember`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: groupId,
        userId: {
            id: memberId,
            name: mmeberFullname
          }
      }
    })
    .then((response) => {
      if(response) 
      {
        removeMember(memberId)
        toggleLoad()
        console.log('deleteMember complete!')
      }
    })
    .catch(function (error) {
      const { message } = error;
      console.log("deleteMember >>> " + message);
    });
  }

  const SearchItemView = ({item}) => {
    if(item)
    return (
      <TouchableRipple onPress={() => getItem(item.fullname, item.email, item.avatar.path, item.isFriend, item.userId)}>
      <View style={[styles.itemStyle, {backgroundColor: backgroundColor}]} >
        <Image source={{uri: item.avatar.path} }  
        style={styles.userPhoto} 
        />
        <View style={styles.userInfo} >
          <Text style={[styles.userFullname, {color: theme.colors.text }]} >
            {item.fullname}
          </Text>
          <View style={styles.userMessage}>
            <Text style={[styles.userUsername, {color: theme.colors.text }]} >
              {'@'}{item.subname ?? item.username}
            </Text>
          </View>
        </View>
        {
          (isAdmin) ? 
            <Menu
            visible={item.userId == visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <View style={{justifyContent: 'center',alignItems: 'center',flex:1}}>
                <Icon 
                  name='ellipsis-h'
                  size={20}
                  color={theme.colors.text}
                  style={[styles.friendshipIcon]}
                  onPress={() => setVisible(item.userId)}
                />
              </View>
            }>
            <Menu.Item onPress={() => promoteAdmin(item.userId)} title={t('common:promoteAdmin')} />
            <Menu.Item onPress={() => deleteMember(item.userId, item.fullname)} title={t('common:deleteChat')} />
          </Menu>
          : <></>
        }
      </View>
      </TouchableRipple>
    );

    return <></>
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

  const onSearch = (searchText) => {
    setSearchQuery(searchText)
    let text = searchText.toLowerCase()
    let trucks = memberList
    let filteredName = trucks.filter((item) => {
      return item.fullname.toLowerCase().match(text) 
      || item.username.toLowerCase().match(text)
    })
    if(searchText)
      setSearchedList(filteredName)
    else
      setSearchedList(memberList)
  }

  return (
        <>
          <Searchbar style={[styles.searchbar, {backgroundColor: backgroundColor}]}
            placeholder={t('common:search')}
            onChangeText={(query) => onSearch(query)}
            value={searchQuery}
            onIconPress={() => onSearch}
            onSubmitEditing={() => onSearch}
          />
          <View style={{height: 371}}>
            {
              (searchedList.length <= 0 || searchedList == null || searchedList == undefined) ? <></> :
              <FlatList
              data={searchedList}
              // onEndReached={onSearch}
              // onEndReachedThreshold={0.1}
              // keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={SearchItemView}
              />      
            }
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
    borderWidth: 1,
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
  friendshipIcon: {
    margin: 5,
    alignSelf:'center',
    backgroundColor: 'transparent',
  },
});


export default GroupMemberList