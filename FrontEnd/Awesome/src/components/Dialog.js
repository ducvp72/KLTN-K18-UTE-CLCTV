import React, { useState } from "react";
import { StyleSheet,TextInput } from "react-native";
import { Button, Text, Dialog } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export const ConfirmDialog = ({visible, toggleDialog, deleteGroup, title}) => {
  const { t } = useTranslation()
  return (
    <Dialog visible={visible} onDismiss={toggleDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      {/* <Dialog.Content>
        <TextInput style={styles.inputDialog} onChangeText={(query) => setCreateGroupName(query)}/>
      </Dialog.Content> */}
      <Dialog.Actions>
        <Button onPress={toggleDialog}>{t('common:cancel')}</Button>
        <Button onPress={deleteGroup}>{t('common:confirm')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export const InputDialog = ({visible, toggleDialog, createGroup, setCreateGroupName, title}) => {
  const { t } = useTranslation()
  return (
    <Dialog visible={visible} onDismiss={toggleDialog}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <TextInput style={styles.inputDialog} onChangeText={(query) => setCreateGroupName(query)}/>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={toggleDialog}>{t('common:cancel')}</Button>
        <Button onPress={createGroup}>{t('common:confirm')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
    inputDialog: {
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'stretch',
        height: 40
    }
})