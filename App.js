import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

const Stack = createStackNavigator();

const BigWordApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BigTex" component={HomeScreen} />
        <Stack.Screen name="BigTexResults" component={BigWordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f7e5e7');
  const [showButtons, setShowButtons] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false); // State to manage theme
  

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); // Lock to portrait mode
    };

    lockOrientation(); // Call the lockOrientation function

    // Unlock the screen orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);



  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    navigation.navigate('BigTexResults', { text, selectedAnimation, backgroundColor });
  };

  const handleClearAll = () => {
    setText('');
  };

  const selectAnimation = (animation) => {
    setSelectedAnimation(selectedAnimation === animation ? null : animation);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={selectedAnimation === 'Hello' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Hello')}
          accessibilityLabel="Select Hand Wave Animation"
        >
          <Text style={styles.buttonText}>Hand Wave</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Alert' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Alert')}
          accessibilityLabel="Select Alert Animation"
        >
          <Text style={styles.buttonText}>Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Celebrate' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Celebrate')}
          accessibilityLabel="Select Celebrate Animation"
        >
          <Text style={styles.buttonText}>Celebrate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Warning' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Warning')}
          accessibilityLabel="Select Warning Animation"
        >
          <Text style={styles.buttonText}>Warning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'CheckMark' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('CheckMark')}
          accessibilityLabel="Select Check Mark Animation"
        >
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LottieView
          source={isNightMode ? require('./assets/animations/Animation-Nighttime.json') : require('./assets/animations/Animation-Daytime.json')}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.contentContainer}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Night Mode</Text>
            <Switch value={isNightMode} onValueChange={toggleNightMode} />
          </View>
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleButtons}>
            <Text style={styles.dropdownText}>Themes</Text>
          </TouchableOpacity>
          {showButtons && renderButtons()}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isNightMode && styles.inputNightMode]}
              onChangeText={handleTextChange}
              value={text}
              placeholder="Type your text here"
              placeholderTextColor={isNightMode ? "#bbb" : "#666"} // Adjust placeholder text color for night mode
              accessibilityHint="Enter your text to see animated results"
            />
            {text !== '' && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleEnterPress}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const BigWordScreen = ({ route, navigation }) => {
  const { text, selectedAnimation, backgroundColor } = route.params;

  useEffect(() => {
    // Lock the screen to landscape mode when the component mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Unlock the screen orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const calculateFontSize = (text) => {
    if (text.length <= 5) {
      return 100;
    } else {
      return Math.floor(500 / text.length);
    }
  };

  const animationSources = {
    Hello: require('./assets/animations/Animation - 1711149112180.json'),
    Alert: require('./assets/animations/Animation - 1709705128416.json'),
    Celebrate: require('./assets/animations/Animation - 1708757997694.json'),
    Warning: require('./assets/animations/Animation - 1709707129524.json'),
    CheckMark: require('./assets/animations/Animation - 1709707194363.json'),
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {selectedAnimation && (
        <LottieView
          source={animationSources[selectedAnimation]}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      <ScrollView vertical>
        <Text numberOfLines={5} style={styles.bigText} ellipsizeMode='clip'>{text}</Text>
      </ScrollView>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  switchContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginRight: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginRight: 10,
    color: '#000', // Default text color
  },
  inputNightMode: {
    color: '#fff', // Text color for night mode
    borderColor: '#fff', // Border color for night mode
  },
  clearButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 170,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '80%',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  selectedButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  bigText: {
    fontSize: 100,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: 50,
    overflow: 'hidden',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'lightgray',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 18,
  },
  animation: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    width: 300,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
  },
  dropdownButton: {
    marginBottom: 10,
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  dropdownText: {
    fontWeight: 'bold',
  },
});

export default BigWordApp;
