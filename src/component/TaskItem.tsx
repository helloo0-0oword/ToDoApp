import React, {FC, Props} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import colors from '../assets/colors';
import images from '../assets/images';
import {Task} from '../assets/types';

const {width} = Dimensions.get('window');

// status 1. pass 2. no check 3. miss
// priority 1. hight 2. medium 3. low

interface TaskProps {
  viewStyle?: ViewStyle;
  index: number;
  onPress: (id: number, index: number) => void;
  onLongPress: (id: number, index: number) => void;
}

const TaskItem: FC<TaskProps & Task> = ({
  id,
  index,
  title,
  date,
  onLongPress,
  endTime,
  status,
  priority,
  onPress,
  viewStyle,
}) => {
  const priorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return colors.lightRed;
      case 2:
        return colors.lightOrange;
      default:
        return colors.lightGreen;
    }
  };
  const timeToString = (date: Date, endTime: Date) => {
    if (new Date(date).toDateString() == new Date().toDateString()) {
      let hour = new Date().getHours() - new Date(endTime).getHours();
      return `${hour} hour`;
    }
  };
  const textColor = (status: number) =>
    status == 2 ? colors.white : colors.whiteGrey;
  const circleColor = (priority: number, status: number) =>
    status == 2 ? priorityColor(priority) : colors.whiteGrey;
  return (
    <Animated.View style={[styles.container, viewStyle]}>
      <TouchableWithoutFeedback
        style={{flexDirection: 'row', alignItems: 'center'}}
        onLongPress={() => onLongPress(id, index)}
        onPress={() => onPress(id, index)}>
        <View
          style={[styles.circle, {borderColor: circleColor(priority, status)}]}>
          {status == 1 ? <Image source={images.iconCheck} /> : null}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.title, {color: textColor(status)}]}>
          {title}
        </Text>
      </TouchableWithoutFeedback>
      <Text style={styles.time}>
        {status != 1 ? timeToString(date, endTime) : 'Passed'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  circle: {
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    maxWidth: width * 0.62,
    marginLeft: 15,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: colors.white,
  },
  time: {
    fontFamily: 'OpenSans-Italic',
    fontSize: 12,
    color: colors.grey,
  },
});

export default TaskItem;
