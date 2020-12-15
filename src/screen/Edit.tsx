import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as taskActions from '../redux/actions/TaskAction';
import colors from '../assets/colors';
import images from '../assets/images';
import {ItemState, LOAD_TASK_LOCAL, Task} from '../assets/types';
import AsyncStorage from '@react-native-community/async-storage';

let typeDate: any = null;

type TitleProps = {
  title: string;
  styleT?: object;
  subTitle: Date | any;
  styleS?: object;
  style?: object;
  image?: any;
  imageRight?: any;
  onPress: (type: string) => void;
};

type RadioProps = {
  id: number;
  text: string;
  color: string;
  isChecked: boolean;
  onPress: (id: number) => void;
  style: object;
};

interface DispatchProps {
  addTask(task: Task): void;
  removeTask(id: number): void;
  editTask(task: Task): void;
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
  items: Task[];
}

const Edit = ({
  items,
  addTask,
  removeTask,
  editTask,
  navigation,
  route,
}: DispatchProps) => {
  const params = route.params;
  const [showWarning, setShowWarning] = useState(false);
  const [name, setName] = useState(params ? params.title : '');
  const [dateState, setDate] = useState(params ? params.date : new Date());
  const [startTimeState, setStartTime] = useState(
    params ? params.startTime : new Date(),
  );
  const [endTimeState, setEndTime] = useState(
    params ? params.endTime : new Date(),
  );
  const [listBtn, setListBtn] = useState(
    params
      ? ListBtn.map((item) => {
          return params.priority == item.id
            ? {...item, isChecked: true}
            : {...item, isChecked: false};
        })
      : ListBtn,
  );
  const [pickerMode, setPickerMode] = useState('' as any);

  const saveData = async (data: Task, isUpdate: boolean = false) => {
    try {
      await AsyncStorage.setItem(
        LOAD_TASK_LOCAL,
        JSON.stringify(
          isUpdate
            ? [...items, data]
            : items.map((e) => (e.id === data.id ? data : e)),
        ),
      );
    } catch (error) {}
  };

  const getDateToString = (dates: Date) => {
    const date = new Date(dates);
    const month = date.toLocaleString('default', {month: 'long'});
    const monthShort = date.toLocaleString('default', {month: 'short'});
    const day = date.toLocaleString('default', {
      day: '2-digit',
    });
    const weekday = date.toLocaleString('default', {
      weekday: 'long',
    });
    const year = date.toLocaleString('default', {
      year: 'numeric',
    });
    const stringDateAndroid = `${date.getDay()} / ${date.getMonth()} / ${date.getFullYear()}`;
    return {
      stringdDate:
        Platform.OS == 'ios' ? `${weekday} ${day} ${month}` : stringDateAndroid,
      fullYear:
        Platform.OS == 'ios'
          ? `${day} ${monthShort} ${year}`
          : stringDateAndroid,
    };
  };

  const getTimeToString = (dates: Date) => {
    const date = new Date(dates);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `  ${hour}:${minute}`;
  };

  const showDatePicker = () => {
    setPickerMode('date');
  };

  const showTimePicker = () => {
    setPickerMode('time');
  };

  const hidePicker = () => {
    setPickerMode('');
  };

  const handleConfirm = (date: Date) => {
    if (typeDate != null)
      switch (typeDate) {
        case 'Date':
          typeDate = '';
          setDate(date);
          break;
        case 'Start time':
          typeDate = '';
          setStartTime(date);
          break;
        case 'End time':
          typeDate = '';
          setEndTime(date);
          break;
        default:
          break;
      }
    hidePicker();
  };

  const TitleSub = ({
    title,
    styleT,
    styleS,
    style,
    image,
    onPress,
  }: TitleProps) => {
    return (
      <View style={[{flexDirection: 'row'}, style]}>
        {image && <Image style={{marginRight: 10}} source={image} />}
        <View>
          <Text style={[styles.title, styleT]}>{title}</Text>
          <TouchableOpacity onPress={() => onPress(title)}>
            <Text style={[styles.subTitle, styleS]}>
              {title == 'Date'
                ? getDateToString(dateState).stringdDate
                : [
                    getDateToString(dateState).fullYear,
                    getTimeToString(
                      title == 'Start time' ? startTimeState : endTimeState,
                    ),
                  ]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RadioBtn = ({
    id,
    text,
    color,
    isChecked,
    onPress,
    style,
  }: RadioProps) => {
    return (
      <TouchableOpacity
        style={[styles.radioBtn, style]}
        onPress={() => onPress(id)}>
        <View style={[styles.circleBorder, {borderColor: color}]}>
          {isChecked ? (
            <View style={[styles.circle, {backgroundColor: color}]} />
          ) : null}
        </View>
        <Text style={[styles.title, {color: colors.white}]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.backgroundColorBlue} />
      <ScrollView contentContainerStyle={styles.container}>
        <DateTimePickerModal
          isVisible={pickerMode !== ''}
          mode={pickerMode}
          onConfirm={handleConfirm}
          onCancel={hidePicker}
        />
        <View style={styles.header}>
          <Text style={styles.textHeader}>Create New Task</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.iconClose} />
          </TouchableOpacity>
        </View>

        <View style={{padding: 20}}>
          <Text style={styles.title}>name</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <TextInput
                numberOfLines={1}
                style={[styles.subTitle, {padding: 0}]}
                placeholder="Enter new Task"
                blurOnSubmit={false}
                placeholderTextColor={colors.white}
                value={name}
                onChangeText={(value) => setName(value)}
              />
              {showWarning && (
                <Text
                  style={[styles.subTitle, {color: colors.red, fontSize: 10}]}>
                  *This field is require
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.viewBorder}>
          <TitleSub
            title="Date"
            subTitle={dateState}
            imageRight={images.iconDateBook}
            onPress={(type) => {
              typeDate = type;
              showDatePicker();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <TitleSub
              title="Start time"
              styleT={{fontSize: 12}}
              subTitle={startTimeState}
              styleS={{fontSize: 14}}
              image={images.iconClock}
              onPress={(type) => {
                typeDate = type;
                showTimePicker();
              }}
            />
            <TitleSub
              title="End time"
              styleT={{fontSize: 12}}
              subTitle={endTimeState}
              styleS={{fontSize: 14}}
              image={images.iconClock}
              onPress={(type) => {
                typeDate = type;
                showTimePicker();
              }}
            />
          </View>
          <View style={{marginTop: 25}}>
            <Text style={styles.title}>Priority</Text>
            <FlatList
              style={{marginLeft: 20}}
              data={listBtn}
              removeClippedSubviews={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item, index}) => {
                return (
                  <RadioBtn
                    {...item}
                    onPress={(id) => {
                      setListBtn((pre) => {
                        return [...pre].map((item) => {
                          return {
                            ...item,
                            isChecked: item.id == id,
                          };
                        });
                      });
                    }}
                    style={{marginTop: index > 0 ? 15 : 20}}
                  />
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.viewBtnBottom}>
        {params ? (
          <TouchableOpacity
            style={{
              backgroundColor: colors.btnBin,
              padding: 14,
              borderRadius: 10,
            }}
            onPress={() => {
              removeTask(params.id);
              navigation.goBack();
            }}>
            <Image source={images.iconBin} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.btnNewTask}
          onPress={() => {
            if (name == '') {
              setShowWarning(true);
              return;
            }
            let checkBox = 1;
            listBtn.map((e) => {
              if (e.isChecked) checkBox = e.id;
            });
            if (params) {
              const task = {
                id: params.id,
                title: name,
                date: dateState,
                startTime: startTimeState,
                endTime: endTimeState,
                status: params.status,
                priority: checkBox,
              };
              saveData(task);
              editTask(task);
            } else {
              const task = {
                id: Math.random(),
                title: name,
                date: dateState,
                startTime: startTimeState,
                endTime: endTimeState,
                status: 2,
                priority: checkBox,
              };
              saveData(task, true);
              addTask(task);
            }
            navigation.goBack();
          }}>
          <Text style={[styles.textHeader, {fontSize: 18}]}>
            {params ? 'Save' : `New Task`}
          </Text>
          <Image source={images.iconUp} style={{marginLeft: 15}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: colors.backgroundColorBlue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  textHeader: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: colors.white,
  },
  title: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: colors.whiteGrey,
  },
  subTitle: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 20,
    color: colors.white,
    marginTop: 5,
  },
  viewBorder: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.backgroundColor,
    padding: 20,
    marginTop: 25,
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewBtnBottom: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    flexDirection: 'row',
  },
  btnNewTask: {
    backgroundColor: colors.btnBlue,
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginLeft: 10,
  },
  circleBorder: {
    borderRadius: 15,
    width: 30,
    height: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 13,
  },
});

const ListBtn = [
  {
    id: 1,
    text: 'Hight',
    isChecked: true,
    color: colors.lightRed,
  },
  {
    id: 2,
    text: 'Medium',
    isChecked: false,
    color: colors.lightOrange,
  },
  {
    id: 3,
    text: 'Low',
    isChecked: false,
    color: colors.lightGreen,
  },
];
const mapStateToProps = (state: ItemState) => ({
  items: state.data,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(taskActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
