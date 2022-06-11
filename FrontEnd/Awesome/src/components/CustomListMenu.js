import React from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {AppStyles} from '../AppStyles';

export default function CustomListMenu(props) {
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Icon 
          name='ellipsis-h'
          size={20}
          color={theme.colors.text}
          style={[styles.friendshipIcon]}
          onPress={() => setVisible(true)}
        />
      }>
      {/* {item.groupType === 'personal' ? <Menu.Item onPress={getItem(item.groupName,)} title={t('common:profile')} /> : <></>} */}
      <Menu.Item onPress={() => {}} title={t('common:deleteChat')} />
    </Menu>
  );
}
