import React from 'react';
import { StyleSheet, View} from 'react-native';
import MenuButton from './MenuButton';
import {AppIcon} from '../AppStyles';
import { Searchbar } from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {logout} from '../reducers';
import { Dimensions } from 'react-native';

export default function SearchBar({navigation}) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    console.log('search query: ', query)
  } 
  
  const onSearch = () => {
      console.log('Da tim kiem ', searchQuery)
  }

  return (
    <Searchbar style={styles.searchbar}
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      onIconPress={onSearch}
      onSubmitEditing={onSearch}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginBottom: 0,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 100,
    width: Dimensions.get('window').width - 110
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});
