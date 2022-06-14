import React from 'react';
import {useSelector} from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
  } from 'react-native';
  import {SCREEN_HEIGHT, SCREEN_WIDTH, AppIcon} from '../../utils/AppStyles.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function QRProfileScreen(props) {
    // console.log("PROPS >>> " + JSON.stringify(props))
    const auth = useSelector((state) => state.auth);
    // console.log("AUTH QR CODE >>>>>> " + auth.qr)
    const base64Image = props.route.params.groupQR ?? auth.qr
    return (
        <KeyboardAwareScrollView>
            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                    <Image style={[styles.avatar,{flexGrow: 1,flex: 1}]} source={props.route.params.groupName ? AppIcon.images.publicAvatar : {uri: auth.user?.avatar}}/>
                    <Text numberOfLines={2} style={[styles.leftText, {flexGrow: 5, flex: 5}]}>{props.route.params.groupName ?? auth.user.fullname }</Text>
                </View>
                <Image
                style={styles.qr} 
                source={{uri: base64Image}}
                />
            </ScrollView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: SCREEN_HEIGHT,
        backgroundColor:'white'
    },
    qr: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        alignSelf:'center',
        // position: 'absolute',
        // zIndex: 9999,
        backgroundColor: 'white'
    },
    subContainer: {
        flex: 1, 
        flexDirection: 'row', 
        paddingHorizontal: 20,
        paddingVertical: 20, 
    },
    avatar: {
        minWidth: 60,
        minHeight: 60,
        maxHeight: 60,
        maxWidth: 60,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        alignSelf:'center',
        backgroundColor: 'white'
    },
    leftText: {
        fontSize: 21, 
        alignSelf: 'center',
        marginLeft: 15
    },
})

export default QRProfileScreen