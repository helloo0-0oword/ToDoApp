import React, {FC} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import colors from '../assets/colors';

type TitleProps = {
  title: string;
  children?: React.ReactNode;
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const Title: FC<TitleProps> = ({title, children, viewStyle, textStyle}) => {
  return (
    <View style={viewStyle}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: colors.darkGrey,
    marginBottom: 20,
    paddingLeft: 20,
  },
});

export default Title;
