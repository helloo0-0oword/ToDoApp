import React, {FC} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import colors from '../assets/colors';
import {Task} from '../assets/types';

type CategoryItemProps = {
  id: number;
  taskNumber: number;
  title: string;
  processNumber: number;
  viewStyle?: ViewStyle;
  listTask: Task[];
};

const CategoryItem: FC<CategoryItemProps> = ({
  id,
  title,
  viewStyle,
  listTask,
}) => {
  const taskColor = (id: number) => {
    switch (id) {
      case 1:
        return colors.red;
      case 2:
        return colors.orange;
      default:
        return colors.green;
    }
  };
  let counterTask = 0;
  listTask.map((item) => id == item.priority && counterTask++);
  const process =
    listTask.length > 0 ? Math.abs((counterTask / listTask.length) * 150) : 0;
  return (
    <View
      style={[styles.container, viewStyle, {backgroundColor: taskColor(id)}]}>
      <Text style={styles.taskNumber}>{`${counterTask} Tasks`}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={{marginTop: 20}}>
        <View style={styles.lineBottom} />
        <View
          style={[
            styles.lineBottom,
            {
              position: 'relative',
              backgroundColor: colors.white,
              width: process,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
    borderRadius: 15,
    backgroundColor: colors.red,
    width: 180,
  },
  taskNumber: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 10,
    color: colors.backgroundColor,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: colors.white,
    marginTop: 5,
  },
  lineBottom: {
    width: 150,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#010319',
    position: 'absolute',
  },
});

export default CategoryItem;
