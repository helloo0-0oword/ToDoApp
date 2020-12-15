import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  Image,
  ImageProps,
  Platform,
  LayoutAnimation,
  StatusBar,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {NavigationProp} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as taskActions from '../redux/actions/TaskAction';
import colors from '../assets/colors';
import {ItemState, LOAD_TASK_LOCAL, Task} from '../assets/types';
import CategoryItem from '../component/CategoryItem';
import TaskItem from '../component/TaskItem';
import Title from '../component/Title';
import images from '../assets/images';
import AsyncStorage from '@react-native-community/async-storage';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ButtonSheet {
  image: ImageProps;
  onPress: () => void;
  color: string;
}

interface StateProps {
  items: Task[];
  navigation: NavigationProp<any, any>;
}

interface DispatchProps {
  loadTask(): void;
  editTask(task: Task): void;
  removeTask(id: number): void;
  getListTaskLocal(list: Task[]): void;
}

type Props = StateProps & DispatchProps;

const Home = ({
  items,
  loadTask,
  editTask,
  removeTask,
  getListTaskLocal,
  navigation,
}: Props) => {
  let taskPick: Task;
  const refRBSheet: any = useRef();
  useEffect(() => {
    loadTask();
    return;
  }, [loadTask]);

  const readData = async () => {
    try {
      const data = await AsyncStorage.getItem(LOAD_TASK_LOCAL);
      getListTaskLocal(data ? JSON.parse(data) : []);
    } catch (error) {}
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(LOAD_TASK_LOCAL, JSON.stringify(items));
    } catch (error) {}
  };

  useEffect(() => {
    readData();
  }, []);

  const ButtonBottom = ({image, onPress, color}: ButtonSheet) => {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 8,
          width: 52,
          height: 52,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
        }}
        onPress={() => onPress()}>
        <Image source={image} />
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <ButtonBottom
        image={images.iconBin}
        color={colors.lightRed}
        onPress={() => {
          removeItem();
          saveData();
          refRBSheet.current.close();
          removeTask(taskPick.id);
        }}
      />
      <ButtonBottom
        image={images.iconEdit}
        color={colors.lightGreen}
        onPress={() => {
          refRBSheet.current.close();
          navigation.navigate('EditScreen', {...taskPick});
        }}
      />
    </View>
  );

  const setAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeIn,
        springDamping: 0.7,
      },
    });
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
  };

  const addItem = (() => {
    return () => {
      setAnimation();
    };
  })();

  const removeItem = () => {
    setAnimation();
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.backgroundColor} />
      <Text style={[styles.title, {margin: 20}]}>What's up, Olivia!</Text>
      <Title title="Category">
        <FlatList
          style={{flexGrow: 0}}
          data={ListCateGory}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, index}) => (
            <CategoryItem
              {...item}
              listTask={items}
              viewStyle={{marginLeft: index > 0 ? 15 : 20}}
            />
          )}
        />
      </Title>
      {items.length > 0 ? (
        <Title title="List Task" viewStyle={{flex: 1, marginTop: 20}}>
          <FlatList
            style={{flexGrow: 1}}
            data={items}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item, index}) => {
              return (
                <TaskItem
                  {...item}
                  index={index}
                  onLongPress={(id, index) => {
                    taskPick = items[index];
                    refRBSheet.current.open();
                  }}
                  onPress={(id, index) => {
                    saveData();
                    editTask({...items[index], status: 1});
                  }}
                  viewStyle={{marginTop: index > 0 ? 15 : 0}}
                />
              );
            }}
          />
        </Title>
      ) : null}
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => navigation.navigate('EditScreen')}>
        <Image source={images.iconAdd} />
      </TouchableOpacity>
      <RBSheet
        height={120}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        {renderContent()}
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: colors.white,
  },
  btnAdd: {
    width: 62,
    height: 62,
    position: 'absolute',
    bottom: 30,
    right: 25,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.btnBlue,
  },
});

const ListCateGory = [
  {
    id: 1,
    taskNumber: 12,
    title: 'Hight',
    processNumber: 15,
  },
  {
    id: 2,
    taskNumber: 12,
    title: 'Medium',
    processNumber: 15,
  },
  {
    id: 3,
    taskNumber: 12,
    title: 'Low',
    processNumber: 15,
  },
];

// status 1. pass 2. no check 3. miss
// priority 1. hight 2. medium 3. low

const testData = [
  {
    title: `Today's Task`,
    listTask: [
      {
        id: 1,
        title: 'Create new template',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 1,
        priority: 1,
      },
      {
        id: 2,
        title: 'Call Tom',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 2,
      },
      {
        id: 3,
        title: 'Check mail',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 1,
        priority: 1,
      },
      {
        id: 4,
        title: 'Lunch with Emma',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 3,
        priority: 3,
      },
    ],
  },
  {
    title: `20/12/2020`,
    listTask: [
      {
        id: 1,
        title: 'Create new template',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 3,
      },
      {
        id: 2,
        title: 'Call Tom',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 2,
      },
      {
        id: 3,
        title: 'Check mail',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 2,
      },
      {
        id: 4,
        title: 'Lunch with Emma',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 1,
        priority: 3,
      },
    ],
  },
  {
    title: `21/12/2020`,
    listTask: [
      {
        id: 1,
        title: 'Create new template',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 3,
      },
      {
        id: 2,
        title: 'Call Tom',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 2,
        priority: 3,
      },
      {
        id: 3,
        title: 'Check mail',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 3,
        priority: 1,
      },
      {
        id: 4,
        title: 'Lunch with Emma',
        date: '20/12/2019',
        timeEnd: '3 hour',
        status: 3,
        priority: 2,
      },
    ],
  },
];

const mapStateToProps = (state: ItemState) => {
  return {
    items: state.data,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(taskActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
