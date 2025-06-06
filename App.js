import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Switch, Dimensions } from 'react-native';
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
        <Stack.Screen name="Fontastic" component={HomeScreen} />
        <Stack.Screen name="FontasticResults" component={BigWordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f7e5e7');
  const [showButtons, setShowButtons] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    lockOrientation();

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync();
    };
  }, []);



  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    navigation.navigate('FontasticResults', { text, selectedAnimation, backgroundColor });
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
          style={selectedAnimation === 'Hi' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Hi')}
          accessibilityLabel="Select Hand Wave Animation"
        >
          <Text style={styles.buttonText}>Hi</Text>
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
          style={selectedAnimation === 'Happy' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Happy')}
          accessibilityLabel="Select Happy Animation"
        >
          <Text style={styles.buttonText}>Happy</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={selectedAnimation === 'Sad' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Sad')}
          accessibilityLabel="Select Happy Animation"
        >
          <Text style={styles.buttonText}>Sad</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={selectedAnimation === 'Thinking' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Thinking')}
          accessibilityLabel="Select Thinking Animation"
        >
          <Text style={styles.buttonText}>Thinking</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={selectedAnimation === 'Love' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Love')}
          accessibilityLabel="Select Love Animation"
        >
          <Text style={styles.buttonText}>Love</Text>
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
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View style={[styles.contentContainer, { height: dimensions.height }]}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Night Mode</Text>
            <Switch value={isNightMode} onValueChange={toggleNightMode} />
          </View>
          <View style={styles.mainContent}>
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
                placeholderTextColor={isNightMode ? "#bbb" : "#666"} 
                accessibilityHint="Enter your text to see animated results"
              />
              {text !== '' && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                  <Ionicons name="close" size={24} color={isNightMode ? "#fff" : "#000"} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleEnterPress}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    Hi: require('./assets/animations/Animation - 1711149112180.json'),
    Alert: require('./assets/animations/Animation - 1709705128416.json'),
    Celebrate: require('./assets/animations/Animation - 1708757997694.json'),
    Happy: require('./assets/animations/happy.json'),
    Sad: require('./assets/animations/sad.json'),
    Thinking: require('./assets/animations/thinking.json'),
    Love: require('./assets/animations/love.json'),
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
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  switchContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 50,
    zIndex: 1,
  },
  switchText: {
    marginRight: 10,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputNightMode: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
    width: '100%',
    maxWidth: 500,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
    minWidth: 80,
  },
  selectedButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'green',
    minWidth: 80,
  },
  dropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdownText: {
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default BigWordApp;
